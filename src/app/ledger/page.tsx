'use client';

import React, { useState, useEffect } from 'react';

interface LedgerItem {
  id: string;
  date: string;
  corridor: 'gcash' | 'ovo' | 'local-vn' | 'local-ng';
  flag: string;
  amount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  txHash: string;
  payoutAddress: string;
  networkFee: number;
}

const mockTransactions: LedgerItem[] = [
  {
    id: "tx-201",
    date: "2026-07-04T12:00:00Z",
    corridor: "gcash",
    flag: "🇵🇭",
    amount: 1200.00,
    status: "COMPLETED",
    txHash: "9642a8b92b6a55dbf2c1a0c8b671a5c6e8f813bf6cd684074ea28b9d6e5a6fd2",
    payoutAddress: "GBSX...6F7G",
    networkFee: 0.00012
  },
  {
    id: "tx-202",
    date: "2026-07-03T18:30:00Z",
    corridor: "ovo",
    flag: "🇮🇩",
    amount: 450.00,
    status: "PROCESSING",
    txHash: "10df84b92b6a55dbf2c1a0c8b671a5c6e8f813bf6cd684074ea28b9d6e5a6fd2",
    payoutAddress: "GD3K...J8Y1",
    networkFee: 0.00015
  },
  {
    id: "tx-203",
    date: "2026-07-01T09:15:00Z",
    corridor: "local-vn",
    flag: "🇻🇳",
    amount: 800.00,
    status: "PENDING",
    txHash: "45fb84b92b6a55dbf2c1a0c8b671a5c6e8f813bf6cd684074ea28b9d6e5a6fd2",
    payoutAddress: "GA7Q...3Z2X",
    networkFee: 0.00011
  },
  {
    id: "tx-204",
    date: "2026-06-28T14:40:00Z",
    corridor: "local-ng",
    flag: "🇳🇬",
    amount: 1500.00,
    status: "FAILED",
    txHash: "88cd84b92b6a55dbf2c1a0c8b671a5c6e8f813bf6cd684074ea28b9d6e5a6fd2",
    payoutAddress: "GC4P...K29Z",
    networkFee: 0.00014
  }
];

export default function HarborLedger() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LedgerItem[]>(mockTransactions);
  
  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [corridorFilter, setCorridorFilter] = useState("ALL");
  
  // Expanded row details state
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Simulated Refresh to demo loading skeleton rows
  const triggerRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1200); // 1.2s skeleton pulse loop matches specs
  };

  const clearAllData = () => {
    // Demo empty state 1: No transactions at all
    setData([]);
  };

  const restoreData = () => {
    setData(mockTransactions);
  };

  const filteredItems = data.filter(item => {
    const matchesSearch = item.txHash.toLowerCase().includes(search.toLowerCase()) || 
                          item.id.toLowerCase().includes(search.toLowerCase()) ||
                          item.payoutAddress.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    const matchesCorridor = corridorFilter === "ALL" || item.corridor === corridorFilter;
    
    return matchesSearch && matchesStatus && matchesCorridor;
  });

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Get status icon and color
  const getStatusDetails = (status: LedgerItem['status']) => {
    switch (status) {
      case 'COMPLETED':
        return { color: 'var(--color-success)', bg: 'var(--color-success-light)', icon: '✓', text: 'Completed' };
      case 'PROCESSING':
        return { color: 'var(--color-gold-hover)', bg: 'var(--color-gold-light)', icon: '⟳', text: 'Processing' };
      case 'PENDING':
        return { color: 'var(--text-secondary)', bg: 'var(--border-light)', icon: '•', text: 'Pending' };
      case 'FAILED':
        return { color: 'var(--color-error)', bg: 'var(--color-error-light)', icon: '✕', text: 'Failed' };
    }
  };

  return (
    <div style={{ maxWidth: '980px' }}>
      
      {/* Header with debug state buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: '700', fontSize: '32px', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            Activity Ledger
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Review the immutable audit log of incoming deposits and currency conversions on Stellar.
          </p>
        </div>
        
        {/* Visual Demo Controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={triggerRefresh} style={{ padding: '8px 14px', fontSize: '12px' }}>
            Demo Loader
          </button>
          {data.length > 0 ? (
            <button className="btn btn-secondary" onClick={clearAllData} style={{ padding: '8px 14px', fontSize: '12px', color: 'var(--color-error)' }}>
              Clear Log
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={restoreData} style={{ padding: '8px 14px', fontSize: '12px' }}>
              Restore Logs
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr 1fr', 
        gap: '16px', 
        marginBottom: '24px',
        padding: '16px',
        background: 'var(--bg-panel)',
        borderRadius: '8px',
        border: '1px solid var(--border-light)'
      }}>
        <input 
          type="text" 
          placeholder="Search by transaction hash, target key..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="ALL">All Statuses</option>
          <option value="COMPLETED">Completed</option>
          <option value="PROCESSING">Processing</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>
        <select value={corridorFilter} onChange={(e) => setCorridorFilter(e.target.value)}>
          <option value="ALL">All Corridors</option>
          <option value="gcash">GCash (Philippines)</option>
          <option value="ovo">OVO (Indonesia)</option>
          <option value="local-vn">Viet Nam Bank</option>
          <option value="local-ng">Nigeria Bank</option>
        </select>
      </div>

      {/* Loading Skeletons State */}
      {loading ? (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Corridor</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ height: '14px', width: '120px', background: '#f1f5f9', borderRadius: '4px', animation: 'pulse 1.3s infinite ease-in-out' }}></div>
                  </td>
                  <td>
                    <div style={{ height: '14px', width: '80px', background: '#f1f5f9', borderRadius: '4px', animation: 'pulse 1.3s infinite ease-in-out' }}></div>
                  </td>
                  <td>
                    <div style={{ height: '20px', width: '90px', background: '#f1f5f9', borderRadius: '10px', animation: 'pulse 1.3s infinite ease-in-out' }}></div>
                  </td>
                  <td>
                    <div style={{ height: '14px', width: '60px', background: '#f1f5f9', borderRadius: '4px', animation: 'pulse 1.3s infinite ease-in-out' }}></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          {/* Empty State 1: No transactions at all */}
          {data.length === 0 && (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 40px', borderStyle: 'dashed' }}>
              <div style={{ fontSize: '32px', color: 'var(--text-muted)', marginBottom: '16px' }}>🗃️</div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>No transactions recorded</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
                You have not completed any payments through your virtual USD account proxy yet.
              </p>
              <button className="btn btn-secondary" onClick={restoreData}>Load mock transactions</button>
            </div>
          )}

          {/* Empty State 2: No results for current filter */}
          {data.length > 0 && filteredItems.length === 0 && (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 40px' }}>
              <div style={{ fontSize: '32px', color: 'var(--text-muted)', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>No matches found</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
                No transaction entries matched your selected filters or search parameters.
              </p>
              <button className="btn btn-secondary" onClick={() => { setSearch(""); setStatusFilter("ALL"); setCorridorFilter("ALL"); }}>
                Reset Filters
              </button>
            </div>
          )}

          {/* Standard Table View */}
          {filteredItems.length > 0 && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date / Tx ID</th>
                    <th>Corridor</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => {
                    const statusInfo = getStatusDetails(item.status);
                    const isExpanded = expandedRow === item.id;
                    
                    return (
                      <React.Fragment key={item.id}>
                        <tr 
                          onClick={() => toggleRow(item.id)}
                          style={{ cursor: 'pointer', background: isExpanded ? 'rgba(197, 160, 89, 0.03)' : 'transparent' }}
                        >
                          <td style={{ fontWeight: '600' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span>{new Date(item.date).toLocaleDateString()}</span>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{item.id}</span>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '18px' }}>{item.flag}</span>
                              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                {item.corridor.replace('local-', '').toUpperCase()}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '11.5px',
                              fontWeight: '700',
                              color: statusInfo.color,
                              background: statusInfo.bg
                            }}>
                              <span style={{ fontSize: '12px' }}>{statusInfo.icon}</span>
                              {statusInfo.text}
                            </span>
                          </td>
                          <td style={{ fontWeight: '700', fontFamily: 'monospace' }}>
                            ${item.amount.toFixed(2)}
                          </td>
                        </tr>

                        {/* Expandable row drawer details */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={4} style={{ background: 'var(--color-gold-light)', padding: '20px 24px', borderBottom: '1px solid var(--border-light)' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
                                <div>
                                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', fontWeight: '600' }}>TARGET PAYOUT KEY</span>
                                  <span style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--text-primary)', display: 'block', margin: '4px 0 12px' }}>
                                    {item.payoutAddress}
                                  </span>

                                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', fontWeight: '600' }}>STELLAR TESTNET TX HASH</span>
                                  <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-primary)', display: 'block', margin: '4px 0 12px', wordBreak: 'break-all' }}>
                                    {item.txHash}
                                  </span>

                                  <a 
                                    href={`https://stellar.expert/explorer/testnet/tx/${item.txHash}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ 
                                      display: 'inline-flex', 
                                      alignItems: 'center', 
                                      gap: '4px', 
                                      fontSize: '12.5px', 
                                      color: 'var(--color-accent)', 
                                      fontWeight: 'bold', 
                                      textDecoration: 'underline' 
                                    }}
                                  >
                                    View Audited Record on StellarExplorer
                                  </a>
                                </div>

                                <div style={{ borderLeft: '1px solid var(--border-light)', paddingLeft: '24px' }}>
                                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', fontWeight: '600' }}>NETWORK COST</span>
                                  <span style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--color-gold-hover)', display: 'block', margin: '4px 0 12px', fontWeight: 'bold' }}>
                                    {item.networkFee} XLM
                                  </span>

                                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', fontWeight: '600' }}>STATUS LOGS</span>
                                  <span style={{ fontSize: '12px', color: 'var(--text-primary)', display: 'block', marginTop: '4px' }}>
                                    Funds successfully parsed, tokenized to USDC, and released to regional liquidity endpoints.
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredItems.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Showing {filteredItems.length} entries
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12.5px' }} disabled={currentPage === 1}>
                  Previous
                </button>
                <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12.5px' }} disabled>
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Inline styles for pulse animations */}
      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
      
    </div>
  );
}
