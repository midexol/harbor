#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol, Vec, panic_with_error};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PayoutItem {
    pub payee: Address,
    pub amount: i128,
    pub department: Symbol,
}
