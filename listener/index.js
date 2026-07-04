const { rpc, scValToNative } = require('@stellar/stellar-sdk');
const fs = require('fs');
const path = require('path');

const RPC_URL = "https://soroban-testnet.stellar.org";
const CONTRACT_ID = "CD4U2T3X5K7G2J6L4A8B9Z1Y0W_MOCK_CONTRACT_ID"; // Replace with deployed contract ID
const STATUS_FILE = path.join(__dirname, 'listener_status.json');

const server = new rpc.Server(RPC_URL);

// Initial state
let lastLedger = 0;
let withdrawals = [];

function saveStatus() {
  fs.writeFileSync(STATUS_FILE, JSON.stringify({ lastLedger, withdrawals }, null, 2));
}

async function startListener() {
  console.log(`Starting HedgePay Off-Chain event listener...`);
  console.log(`Subscribed to contract: ${CONTRACT_ID}`);
  
  if (fs.existsSync(STATUS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8'));
      lastLedger = data.lastLedger || 0;
      withdrawals = data.withdrawals || [];
      console.log(`Resumed from ledger: ${lastLedger}`);
    } catch (e) {
      console.log("No previous status found. Initializing new log.");
    }
  }

  // Poll for events every 5 seconds
  setInterval(async () => {
    try {
      // Get latest ledger sequence
      const latestLedgerRes = await server.getLatestLedger();
      const currentLedger = latestLedgerRes.sequence;

      if (lastLedger === 0) {
        lastLedger = currentLedger - 10; // Start 10 ledgers back if first run
      }

      if (lastLedger >= currentLedger) {
        return;
      }

      console.log(`Polling ledgers ${lastLedger + 1} to ${currentLedger}...`);

      const eventsRes = await server.getEvents({
        startLedger: lastLedger + 1,
        filters: [
          {
            type: "contract",
            contractIds: [CONTRACT_ID]
          }
        ],
        limit: 100
      });

      for (const event of eventsRes.events) {
        processEvent(event);
      }

      lastLedger = currentLedger;
      saveStatus();
    } catch (e) {
      console.error("Error polling events:", e.message);
    }
  }, 5000);
}

function processEvent(event) {
  try {
    const topics = event.topic.map(t => scValToNative(t));
    
    // Topic structure: (Symbol("payout"), batch_id: u64, payee: Address)
    if (topics[0] !== "payout") {
      return; // Skip other event types
    }

    const batchId = topics[1].toString();
    const payee = topics[2].toString();
    
    // Data structure: (amount: i128, department: Symbol)
    const dataVal = scValToNative(event.value);
    const amount = Number(dataVal[0]) / 10000000; // 7 decimals
    const department = dataVal[1].toString();

    console.log(`\n[EVENT CAPTURED] Batch ID: ${batchId}`);
    console.log(`- Recipient Payee: ${payee}`);
    console.log(`- Amount Allocated: $${amount.toFixed(2)} USDC`);
    console.log(`- Department Code: ${department}`);

    // Simulate SEP-24 / SEP-31 Anchor Routing
    initiateAnchorPayout({ batchId, payee, amount, department });
  } catch (e) {
    console.error("Error processing event XDR:", e);
  }
}

function initiateAnchorPayout(payout) {
  console.log(`Triggering SEP-24/31 payout router...`);
  
  // Simulated Corridor Routing based on payee or department metadata
  let corridor = "Local USD";
  if (payout.department.includes("PH") || payout.payee.startsWith("GD")) {
    corridor = "GCash (Philippines)";
  } else if (payout.department.includes("ID")) {
    corridor = "OVO (Indonesia)";
  } else if (payout.department.includes("VN")) {
    corridor = "VietNam Local Bank Transfer";
  }

  console.log(`- Selected Anchor corridor: ${corridor}`);
  console.log(`- Status: Payout Pending with Local Cash-Out rail.`);

  const withdrawal = {
    txId: Math.random().toString(36).substring(2, 15),
    batchId: payout.batchId,
    payee: payout.payee,
    amount: payout.amount,
    corridor,
    status: "COMPLETE", // Instantly clear testnet withdrawals
    timestamp: new Date().toISOString()
  };

  withdrawals.push(withdrawal);
  console.log(`[ANCHOR SUCCESS] Payout reference ${withdrawal.txId} processed successfully into ${corridor}.\n`);
}

startListener();
