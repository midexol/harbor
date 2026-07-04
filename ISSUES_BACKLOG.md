# HedgePay Project Backlog & Future Specifications

This backlog tracks the remaining scope items mapped for Phase 4 production alignment before transitioning from Soroban Testnet to Stellar Mainnet.

---

## 1. Multi-Sig Treasury Integration (FR-18)
- **Status:** Backlog
- **Impact:** Critical Security
- **Details:** The current batch payroll contract pulls stablecoins from a treasury address using `transfer_from` authorized by the treasury key. In production, the treasury address should be a Soroban multisig contract (with threshold signatures) rather than a single signature key.
- **Action items:**
  - Build integration wrapper for G-address multisig thresholds.
  - Assert that all contract execution authorization requires multiple signatures inside `execute_batch_payroll`.

## 2. ERP Accounting Ledger Integrations (FR-17)
- **Status:** Stretch Goal
- **Impact:** Administrative Efficiency
- **Details:** The off-chain event listener logs on-chain payouts into a local database/file. In production, this data should sync directly with QuickBooks, Xero, or other legacy ERP systems using their REST APIs.
- **Action items:**
  - Build API connection client for QuickBooks OAuth2 token exchange.
  - Map `payout_logged` events to double-entry ledger items (debit payroll expenses, credit stablecoin bank accounts).

## 3. Real Anchor Integration & KYT Compliance
- **Status:** Backlog
- **Impact:** Operational Legality
- **Details:** The listener currently mock-executes SEP-24/31 anchor withdrawals. Moving to production requires integrating a registered anchor (like Anclap or Clickpesa) and completing KYC/KYT verification flows.
- **Action items:**
  - Build SEP-10 authenticated handshakes.
  - Implement compliance API callbacks for transaction status monitoring.
