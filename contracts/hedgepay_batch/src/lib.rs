#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, contracterror, symbol_short, Address, Env, Symbol, Vec, panic_with_error};

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


