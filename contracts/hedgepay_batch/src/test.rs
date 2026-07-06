#![cfg(test)]
use super::*;
use soroban_sdk::{
    Env, Address, testutils::Address as _, token::Client as TokenClient, 
    token::StellarAssetClient
};

#[contract]
pub struct MockDexRouter;

#[contractimpl]
impl MockDexRouter {
    pub fn swap(env: Env, from_token: Address, to_token: Address, amount: i128, recipient: Address) -> i128 {
        // Verify from_token has transfer approval (DEX transfers from caller contract to itself)
        // Since mock_all_auths is enabled, we simulate the swap:
        // 1. Transfer from_token from the batch payroll contract (which is caller) to the DEX
        // In a mock, we can just do nothing on from_token transfer, or call transfer_from:
        let from_client = TokenClient::new(&env, &from_token);
        
        // 2. Transfer target token from DEX to the recipient
        let to_client = TokenClient::new(&env, &to_token);
        to_client.transfer(&env.current_contract_address(), &recipient, &amount);
        amount
    }
}

struct TestContext {
    env: Env,
    admin: Address,
    treasury: Address,
    token_address: Address,
    token_client: TokenClient,
    token_admin_client: StellarAssetClient,
    contract_id: Address,
    contract_client: HedgePayBatchClient,
}

fn setup_test_context() -> TestContext {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let treasury = Address::generate(&env);

    let token_admin = Address::generate(&env);
    let token_address = env.register_stellar_asset_contract(token_admin.clone());
    let token_client = TokenClient::new(&env, &token_address);
    let token_admin_client = StellarAssetClient::new(&env, &token_address);

    let contract_id = env.register_contract(None, HedgePayBatch);
    let contract_client = HedgePayBatchClient::new(&env, &contract_id);

    contract_client.initialize(&admin, &treasury, &token_address);

    TestContext {
        env,
        admin,
        treasury,
        token_address,
        token_client,
        token_admin_client,
        contract_id,
        contract_client,
    }
}

#[test]
fn test_successful_batch_payout() {
    let ctx = setup_test_context();

    let payee1 = Address::generate(&ctx.env);
    let payee2 = Address::generate(&ctx.env);

    // Mint tokens to treasury
    ctx.token_admin_client.mint(&ctx.treasury, &1000);
    assert_eq!(ctx.token_client.balance(&ctx.treasury), 1000);

    // Create batch items
    let mut items = Vec::new(&ctx.env);
    items.push_back(PayoutItem {
        payee: payee1.clone(),
        amount: 300,
        department: symbol_short!("ENG"),
        target_token: Option::None,
    });
    items.push_back(PayoutItem {
        payee: payee2.clone(),
        amount: 700,
        department: symbol_short!("HR"),
        target_token: Option::None,
    });

    let request = BatchRequest {
        items,
        declared_total: 1000,
        batch_id: 1,
    };

    // Execute batch
    ctx.contract_client.execute_batch_payroll(&request);

    // Verify balances
    assert_eq!(ctx.token_client.balance(&ctx.treasury), 0);
    assert_eq!(ctx.token_client.balance(&payee1), 300);
    assert_eq!(ctx.token_client.balance(&payee2), 700);

    // Verify batch counter incremented
    assert_eq!(ctx.contract_client.batch_counter(), 1);
}

#[test]
fn test_multi_asset_swap_payout() {
    let ctx = setup_test_context();

    let payee1 = Address::generate(&ctx.env); // Direct USDC recipient
    let payee2 = Address::generate(&ctx.env); // Swap recipient (requesting EURC)

    // Mint USDC base tokens to treasury
    ctx.token_admin_client.mint(&ctx.treasury, &1000);

    // Register a secondary token (EURC mock)
    let target_token_admin = Address::generate(&ctx.env);
    let target_token_address = ctx.env.register_stellar_asset_contract(target_token_admin.clone());
    let target_token_client = TokenClient::new(&ctx.env, &target_token_address);
    let target_token_admin_client = StellarAssetClient::new(&ctx.env, &target_token_address);

    // Deploy mock DEX router contract
    let router_id = ctx.env.register_contract(None, MockDexRouter);
    
    // Set DEX router inside the batch payroll contract
    ctx.contract_client.update_dex_router(&router_id);
    assert_eq!(ctx.contract_client.dex_router(), Option::Some(router_id.clone()));

    // Seed target tokens (EURC) into the mock DEX router
    target_token_admin_client.mint(&router_id, &1000);
    assert_eq!(target_token_client.balance(&router_id), 1000);

    // Create batch items (payee2 requests swaps to EURC target token)
    let mut items = Vec::new(&ctx.env);
    items.push_back(PayoutItem {
        payee: payee1.clone(),
        amount: 400,
        department: symbol_short!("ENG"),
        target_token: Option::None,
    });
    items.push_back(PayoutItem {
        payee: payee2.clone(),
        amount: 600,
        department: symbol_short!("MKT"),
        target_token: Option::Some(target_token_address.clone()),
    });

    let request = BatchRequest {
        items,
        declared_total: 1000,
        batch_id: 1,
    };

    // Execute batch payroll
    ctx.contract_client.execute_batch_payroll(&request);

    // Verify treasury has been depleted of USDC
    assert_eq!(ctx.token_client.balance(&ctx.treasury), 0);

    // Verify payee1 received 400 USDC directly
    assert_eq!(ctx.token_client.balance(&payee1), 400);

    // Verify payee2 received NO USDC
    assert_eq!(ctx.token_client.balance(&payee2), 0);

    // Verify payee2 received 600 EURC from swap execution
    assert_eq!(target_token_client.balance(&payee2), 600);
}

#[test]
#[should_panic(expected = "HostError: Error(Contract, #4)")]
fn test_sum_mismatch_too_high() {
    let ctx = setup_test_context();

    let payee1 = Address::generate(&ctx.env);
    ctx.token_admin_client.mint(&ctx.treasury, &1000);

    let mut items = Vec::new(&ctx.env);
    items.push_back(PayoutItem {
        payee: payee1,
        amount: 1000,
        department: symbol_short!("ENG"),
        target_token: Option::None,
    });

    let request = BatchRequest {
        items,
        declared_total: 1100, // Too high
        batch_id: 1,
    };

    ctx.contract_client.execute_batch_payroll(&request);
}

#[test]
#[should_panic(expected = "HostError: Error(Contract, #4)")]
fn test_sum_mismatch_too_low() {
    let ctx = setup_test_context();

    let payee1 = Address::generate(&ctx.env);
    ctx.token_admin_client.mint(&ctx.treasury, &1000);

    let mut items = Vec::new(&ctx.env);
    items.push_back(PayoutItem {
        payee: payee1,
        amount: 1000,
        department: symbol_short!("ENG"),
        target_token: Option::None,
    });

    let request = BatchRequest {
        items,
        declared_total: 900, // Too low
        batch_id: 1,
    };

    ctx.contract_client.execute_batch_payroll(&request);
}

#[test]
#[should_panic(expected = "HostError: Error(Contract, #5)")]
fn test_empty_batch() {
    let ctx = setup_test_context();

    let items = Vec::new(&ctx.env);

    let request = BatchRequest {
        items,
        declared_total: 0,
        batch_id: 1,
    };

    ctx.contract_client.execute_batch_payroll(&request);
}

#[test]
#[should_panic(expected = "HostError: Error(Contract, #6)")]
fn test_batch_size_limit_overflow() {
    let ctx = setup_test_context();

    let payee = Address::generate(&ctx.env);
    let mut items = Vec::new(&ctx.env);

    for _ in 0..51 {
        items.push_back(PayoutItem {
            payee: payee.clone(),
            amount: 10,
            department: symbol_short!("ENG"),
            target_token: Option::None,
        });
    }

    let request = BatchRequest {
        items,
        declared_total: 510,
        batch_id: 1,
    };

    ctx.contract_client.execute_batch_payroll(&request);
}

#[test]
#[should_panic]
fn test_unauthorized_config_changes() {
    let env = Env::default();
    let admin = Address::generate(&env);
    let treasury = Address::generate(&env);
    let token = Address::generate(&env);
    let bad_actor = Address::generate(&env);

    let contract_id = env.register_contract(None, HedgePayBatch);
    let contract_client = HedgePayBatchClient::new(&env, &contract_id);

    contract_client.initialize(&admin, &treasury, &token);

    // Call update_admin (which requires admin auth) without mocking auth or signing
    contract_client.update_admin(&bad_actor);
}

#[test]
fn test_authorized_config_updates() {
    let ctx = setup_test_context();

    let new_admin = Address::generate(&ctx.env);
    let new_treasury = Address::generate(&ctx.env);

    // Update config (mock_all_auths is enabled in setup_test_context)
    ctx.contract_client.update_admin(&new_admin);
    ctx.contract_client.update_treasury(&new_treasury);
    ctx.contract_client.update_max_batch(&100);

    // Verify changes
    assert_eq!(ctx.contract_client.admin(), Some(new_admin));
    assert_eq!(ctx.contract_client.treasury(), Some(new_treasury));
    assert_eq!(ctx.contract_client.max_batch_size(), 100);
}
