# Harbor // Borderless Freelancer & Agency Banking on Stellar

Harbor is an enterprise-grade, gas-optimized batch salary routing and onchain sub-ledger accounting system built for the Stellar network using Soroban smart contracts. The platform is engineered specifically to eliminate cross-border settlement latency and predatory remittance fees for remote contractors, freelancers, and agencies across Southeast Asia (Philippines, Indonesia, Vietnam) and Africa (Nigeria).

---

## 🚀 Key Features & Value Proposition

*   **Soroban Batch Payouts:** Traditional onchain bulk payments loops are gas-intensive. Harbor uses an optimized Soroban structural loop to parse arrays, enabling an agency or employer to settle dozens of unique contractor wallets in a single transaction block—slashing operational transaction costs.
*   **Production-Hardened Security:** Built using Rust's memory safety guarantees and the Soroban SDK's robust authorization patterns (`require_auth`).
*   **Anti-Frontrunning Reconciliation:** The smart contract calculates internal array token balances dynamically on-chain and verifies them against the submitted `declared_total`. If a parameter mismatch is detected, the contract explicitly reverts (`panic!`).
*   **Sub-ledger ERP Metadata Routing:** Every payroll distribution emits structured onchain events (`payout_logged`). These events emit granular metadata tracking target departments, which off-chain listeners parse to sync balance sheets directly into QuickBooks or Xero.

---

## 🛠️ Technical Architecture & Stack

### System Workflow
1.  **HR Portal:** The enterprise admin uploads a standard CSV detailing payee wallets, target corridors, and USDC allocations.
2.  **Onchain Aggregator:** The frontend aggregates allocations and submits a unified payload to `execute_batch_payroll` on Stellar Testnet.
3.  **Cryptographic Settlement:** The contract pulls funds from the treasury multi-sig via SEP-41 token interfaces, verifies parameters, and triggers multi-payout distributions.
4.  **Off-Ramp Webhooks:** The off-chain listener catches event structures containing regional routing instructions, signaling off-chain liquidity proxies to clear local fiat settlements.

### Tech Stack
*   **Smart Contracts:** Rust (`soroban-sdk v21.0.0`)
*   **Frontend Interface:** Next.js / React (Vanilla CSS, Deep Navy + Gold Accent)
*   **Target Rail:** Stellar Soroban Testnet

---

## 📂 Repository Structure

```text
harbor/
├── contracts/
│   └── hedgepay_batch/         <-- Soroban smart contract package
│       ├── Cargo.toml          <-- Package dependencies
│       └── src/
│           ├── lib.rs          <-- Core batch contract logic
│           └── test.rs         <-- Adversarial test suites
├── Cargo.toml                  <-- Root Cargo workspace
├── CONTRIBUTING.md             <-- Contribution guidelines & Setup
├── LICENSE                     <-- Open-source MIT License
├── .gitignore                  <-- Project exclusion filter
└── README.md                   <-- System documentation
```

---
