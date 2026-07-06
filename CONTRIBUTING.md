# Contributing to Harbor

Thank you for your interest in contributing to **Harbor**! We welcome community contributions to make global payroll splits and currency routing safer, faster, and more accessible.

This guide outlines our codebase structure, local development environment setup, pull request workflows, and the active issues list for the **Stellar Drips Wave Program**.

---

## 🛠️ Local Development Environment Setup

Harbor is split into three main components:
1. **Stellar Soroban Contracts** (Rust)
2. **Off-Chain Listener** (Node.js)
3. **Frontend Dashboard** (Next.js / TypeScript)

### Prerequisites
*   Rust (latest stable toolchain)
*   Node.js (v18+) & npm
*   Stellar Freighter Wallet extension

### 1. Smart Contract Setup
Navigate to the contracts directory:
```bash
cd contracts/hedgepay_batch
```
Build the contract:
```bash
cargo build --target wasm32-unknown-unknown --release
```
Run the unit test suite:
```bash
cargo test
```
*Note for Windows users:* If compilation macro libraries fail due to MinGW path references, ensure you verify build outputs directly targeting webassembly: `cargo build --target wasm32-unknown-unknown --release`.

### 2. Frontend Dashboard Setup
Navigate to the root directory and install dependencies:
```bash
npm install
```
Start the development server:
```bash
npm run dev
```
Verify type-checking runs cleanly:
```bash
npx tsc --noEmit
```

---

## 📋 Pull Request Workflow

1.  **Fork the Repository:** Create your own fork and clone it locally.
2.  **Create a Branch:** Create a branch for your changes:
    ```bash
    git checkout -b feature/my-new-feature
    ```
3.  **Code and Test:** Make your changes, ensuring that all existing tests pass and TypeScript compilations are successful.
4.  **Commit Conventions:** We prefer clean, organic commit messages:
    *   `fixed typos in settings layout`
    *   `added ledger details copy trigger`
5.  **Submit PR:** Submit your pull request targeting the `main` branch. Ensure you fill out the details in the provided `.github/PULL_REQUEST_TEMPLATE.md`.

---

## 🗳️ Drips Wave Active Issues List

For the active **Stellar Drips Wave** sprint, contributors can claim the following scoped protocol engineering issues:

### 1. [COMPLETED & SHIPPED] Integrate DEX Path-Payments for Multi-Asset Splits
*   **Status:** Resolved in `main` branch.
*   **Resolution Details:** Upgraded `lib.rs` and `test.rs` to configure `DexRouter` coordinates. Payout items now accept `target_token` parameter. The smart contract automatically approves the DEX router and routes deposits through DEX swaps before final recipient transfers.
*   **Shipped Files:** `contracts/hedgepay_batch/src/lib.rs` & `test.rs`

### 2. [HIGH] Implement Soroban Fee-Sponsorship / Fee-Bump Integration
*   **Goal:** Allow gasless onboarding for remote contractors by letting Harbor's treasury address sponsor the transaction resources and fees. Construct fee-bump transaction wrappers in the relayer subscriber client.
*   **Target Files:** `listener/index.js` & `contracts/hedgepay_batch/`
*   **Required Skills:** Stellar transaction construction, relayer networks, XDR manipulation.

### 3. [HIGH] Defer Payouts against Sanctioned Address Blacklist Oracle
*   **Goal:** Integrate an on-chain compliance blacklist verification filter. Query an administrative blacklist map or a compliance oracle contract to assert that target payout addresses are unrestricted before executing payouts.
*   **Target Files:** `contracts/hedgepay_batch/src/lib.rs`
*   **Required Skills:** Rust, Oracle integration, role access controls.

### 4. [MEDIUM] Support Offline Transaction Envelope Signing
*   **Goal:** Allow administrative coordinators to authorize batch payroll runs offline. The admin signs the hash of the batch transactions payload locally, producing an Ed25519 signature that a relayer submits to the smart contract.
*   **Target Files:** `contracts/hedgepay_batch/src/lib.rs` & `test.rs`
*   **Required Skills:** Ed25519 signature verification on-chain, Soroban cryptography APIs.
