#![cfg(test)]
use super::*;
use soroban_sdk::{Env, Address, testutils::Address as _, token::Client as TokenClient, token::StellarAssetClient};

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
