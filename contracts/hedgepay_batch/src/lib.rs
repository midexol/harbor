#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, contracterror, symbol_short, Address, Env, Symbol, Vec, panic_with_error, token::Client as TokenClient};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    NotInitialized = 1,
    AlreadyInitialized = 2,
    Unauthorized = 3,
    SumMismatch = 4,
    EmptyBatch = 5,
    BatchSizeExceeded = 6,
    InvalidAdmin = 7,
    InvalidTreasury = 8,
    InvalidToken = 9,
    InvalidRecipient = 10,
    InvalidAmount = 11,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    Treasury,
    Token,
    MaxBatchSize,
    BatchCounter,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PayoutItem {
    pub payee: Address,
    pub amount: i128,
    pub department: Symbol,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BatchRequest {
    pub items: Vec<PayoutItem>,
    pub declared_total: i128,
    pub batch_id: u64,
}

#[contract]
pub struct HedgePayBatch;

#[contractimpl]
impl HedgePayBatch {
    pub fn initialize(env: Env, admin: Address, treasury: Address, token: Address) {
        if get_admin(&env).is_some() {
            panic_with_error!(&env, Error::AlreadyInitialized);
        }
        set_admin(&env, &admin);
        set_treasury(&env, &treasury);
        set_token(&env, &token);
        set_max_batch_size(&env, 50);
        set_batch_counter(&env, 0);
    }

    pub fn admin(env: Env) -> Option<Address> {
        get_admin(&env)
    }

    pub fn treasury(env: Env) -> Option<Address> {
        get_treasury(&env)
    }

    pub fn token(env: Env) -> Option<Address> {
        get_token(&env)
    }

    pub fn max_batch_size(env: Env) -> u32 {
        get_max_batch_size(&env)
    }

    pub fn batch_counter(env: Env) -> u64 {
        get_batch_counter(&env)
    }

    pub fn update_admin(env: Env, new_admin: Address) {
        let admin = get_admin(&env).unwrap_or_else(|| {
            panic_with_error!(&env, Error::NotInitialized);
        });
        admin.require_auth();
        set_admin(&env, &new_admin);
    }

    pub fn update_treasury(env: Env, new_treasury: Address) {
        let admin = get_admin(&env).unwrap_or_else(|| {
            panic_with_error!(&env, Error::NotInitialized);
        });
        admin.require_auth();
        set_treasury(&env, &new_treasury);
    }

    pub fn update_max_batch(env: Env, new_max: u32) {
        let admin = get_admin(&env).unwrap_or_else(|| {
            panic_with_error!(&env, Error::NotInitialized);
        });
        admin.require_auth();
        set_max_batch_size(&env, new_max);
    }

    pub fn execute_batch_payroll(env: Env, request: BatchRequest) {
        let max_size = get_max_batch_size(&env);
        let len = request.items.len();
        if len == 0 {
            panic_with_error!(&env, Error::EmptyBatch);
        }
        if len > max_size {
            panic_with_error!(&env, Error::BatchSizeExceeded);
        }

        let mut computed_sum: i128 = 0;
        for item in request.items.iter() {
            if item.amount <= 0 {
                panic_with_error!(&env, Error::InvalidAmount);
            }
            computed_sum = computed_sum.checked_add(item.amount).unwrap_or_else(|| {
                panic_with_error!(&env, Error::InvalidAmount);
            });
        }

        if computed_sum != request.declared_total {
            panic_with_error!(&env, Error::SumMismatch);
        }

        let token_addr = get_token(&env).unwrap_or_else(|| {
            panic_with_error!(&env, Error::NotInitialized);
        });
        let treasury = get_treasury(&env).unwrap_or_else(|| {
            panic_with_error!(&env, Error::NotInitialized);
        });

        // Treasury authorization is required to pull the total payroll sum
        treasury.require_auth();

        let token_client = TokenClient::new(&env, &token_addr);
        token_client.transfer_from(
            &env.current_contract_address(),
            &treasury,
            &env.current_contract_address(),
            &request.declared_total,
        );

        // Distribute tokens to individual payees
        for item in request.items.iter() {
            token_client.transfer(&item.payee, &item.amount);
            
            // Emit payout_logged event
            env.events().publish(
                (symbol_short!("payout"), request.batch_id, item.payee.clone()),
                (item.amount, item.department.clone()),
            );
        }

        // Emit overall payroll_executed event
        env.events().publish(
            (symbol_short!("executed"), env.current_contract_address()),
            (request.batch_id, request.declared_total, request.items.len() as u32),
        );

        // Increment batch counter
        let counter = get_batch_counter(&env);
        set_batch_counter(&env, counter + 1);
    }
}

fn get_admin(env: &Env) -> Option<Address> {
    env.storage().instance().get(&DataKey::Admin)
}

fn set_admin(env: &Env, admin: &Address) {
    env.storage().instance().set(&DataKey::Admin, admin);
}

fn get_treasury(env: &Env) -> Option<Address> {
    env.storage().instance().get(&DataKey::Treasury)
}

fn set_treasury(env: &Env, treasury: &Address) {
    env.storage().instance().set(&DataKey::Treasury, treasury);
}

fn get_token(env: &Env) -> Option<Address> {
    env.storage().instance().get(&DataKey::Token)
}

fn set_token(env: &Env, token: &Address) {
    env.storage().instance().set(&DataKey::Token, token);
}

fn get_max_batch_size(env: &Env) -> u32 {
    env.storage().instance().get(&DataKey::MaxBatchSize).unwrap_or(50)
}

fn set_max_batch_size(env: &Env, size: u32) {
    env.storage().instance().set(&DataKey::MaxBatchSize, &size);
}

fn get_batch_counter(env: &Env) -> u64 {
    env.storage().persistent().get(&DataKey::BatchCounter).unwrap_or(0)
}

fn set_batch_counter(env: &Env, counter: u64) {
    env.storage().persistent().set(&DataKey::BatchCounter, &counter);
}


