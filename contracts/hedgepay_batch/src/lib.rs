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
        // empty skeleton for now
    }
}

