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
*Note for Windows users:* If compilation macro libraries fail due to MinGW path references, ensure you append the Rust GNU self-contained bin path to your shell environment `$env:PATH`.

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
5.  **Submit PR:** Submit your pull request targeting the `main` branch. Ensure you fill out the details in the provided `PULL_REQUEST_TEMPLATE.md`.

---

## 🗳️ Drips Wave Active Issues List

For the active **Stellar Drips Wave** sprint, contributors can claim the following scoped issues. Each issue corresponds to a specific points multiplier determined by its complexity level:

### 1. [TRIVIAL] Clean up React Warnings & Component Lints
*   **Goal:** Clean up compiler lints, React keys warning logs, and formatting inconsistencies in frontend views.
*   **Target Files:** `src/app/**/*.tsx`
*   **Required Skills:** React, CSS, TypeScript.

### 2. [MEDIUM] Add Copy-to-Clipboard Triggers for Account Coordinates
*   **Goal:** Implement a visual "Copy" button next to the Routing and Account numbers inside the Virtual US Account card on the Overview dashboard. Show a temporary "Copied!" state when clicked.
*   **Target Files:** `src/app/dashboard/page.tsx`
*   **Required Skills:** React state, HTML clipboard API.

### 3. [HIGH] Implement Multi-Sig Escrow Payout Support
*   **Goal:** Modify the Soroban Rust contract to verify payouts sourced from a multi-signature threshold escrow account. Ensure `require_auth` handles multiple signing thresholds before executing payroll sweeps.
*   **Target Files:** `contracts/hedgepay_batch/src/lib.rs` & `test.rs`
*   **Required Skills:** Rust, Soroban SDK, cryptography concepts.
