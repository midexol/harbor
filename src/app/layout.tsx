'use client';

import './globals.css';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Hide side navigation on marketing home and auth pages
  const hideSidebar = pathname === '/' || pathname === '/auth';

  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
          
          {!hideSidebar && (
            <>
              {/* Collapsible desktop side navigation bar */}
              <aside 
                className="sidebar-nav"
                style={{ 
                  width: collapsed ? '80px' : '260px', 
                  background: 'var(--bg-panel)', 
                  borderRight: '1px solid var(--border-light)', 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: collapsed ? '32px 12px' : '32px 24px',
                  position: 'fixed',
                  height: '100vh',
                  top: 0,
                  left: 0,
                  zIndex: 100,
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                  {/* Header row containing logo and collapse toggle */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: collapsed ? 'center' : 'space-between',
                    gap: '8px'
                  }}>
                    {!collapsed && (
                      <div style={{ 
                        fontFamily: 'var(--font-sans)', 
                        fontWeight: '800', 
                        fontSize: '18px', 
                        letterSpacing: '1.5px', 
                        color: 'var(--text-primary)'
                      }}>
                        HARBOR
                      </div>
                    )}
                    {collapsed && (
                      <div style={{ 
                        fontFamily: 'var(--font-sans)', 
                        fontWeight: '800', 
                        fontSize: '18px', 
                        color: 'var(--color-gold)'
                      }}>
                        H
                      </div>
                    )}
                    
                    {/* Collapse / Expand Toggle Button */}
                    <button 
                      onClick={() => setCollapsed(!collapsed)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        padding: '4px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fdfaf6'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {collapsed ? (
                          <polyline points="9 18 15 12 9 6"></polyline>
                        ) : (
                          <polyline points="15 18 9 12 15 6"></polyline>
                        )}
                      </svg>
                    </button>
                  </div>

                  {/* Navigation Links with SVGs and tooltips */}
                  <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <Link 
                      href="/dashboard" 
                      className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`} 
                      style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
                      title={collapsed ? "Dashboard Overview" : undefined}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="9" rx="1" />
                        <rect x="14" y="3" width="7" height="5" rx="1" />
                        <rect x="14" y="12" width="7" height="9" rx="1" />
                        <rect x="3" y="16" width="7" height="5" rx="1" />
                      </svg>
                      {!collapsed && <span>Overview</span>}
                    </Link>

                    <Link 
                      href="/recipients" 
                      className={`nav-link ${pathname === '/recipients' ? 'active' : ''}`} 
                      style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
                      title={collapsed ? "Manage Recipients" : undefined}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      {!collapsed && <span>Recipients</span>}
                    </Link>

                    <Link 
                      href="/vaults" 
                      className={`nav-link ${pathname === '/vaults' ? 'active' : ''}`} 
                      style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
                      title={collapsed ? "Yield Vaults" : undefined}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                        <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path>
                      </svg>
                      {!collapsed && <span>Yield Vaults</span>}
                    </Link>

                    <Link 
                      href="/ledger" 
                      className={`nav-link ${pathname === '/ledger' ? 'active' : ''}`} 
                      style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
                      title={collapsed ? "Activity Ledger" : undefined}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                      </svg>
                      {!collapsed && <span>Activity Ledger</span>}
                    </Link>

                    <Link 
                      href="/settings" 
                      className={`nav-link ${pathname === '/settings' ? 'active' : ''}`} 
                      style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
                      title={collapsed ? "System Settings" : undefined}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                      </svg>
                      {!collapsed && <span>Settings</span>}
                    </Link>
                  </nav>
                </div>

                {/* Persistent Balance Sidebar Footer Widget */}
                <div className="profile-card" style={{ padding: collapsed ? '12px 6px' : '16px', alignItems: collapsed ? 'center' : 'stretch' }}>
                  {!collapsed && (
                    <div style={{ marginBottom: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', fontWeight: '600' }}>TOTAL BALANCE</span>
                      <span style={{ fontSize: '14px', fontWeight: '800', fontFamily: 'monospace', color: 'var(--text-primary)' }}>$4,820.00</span>
                    </div>
                  )}
                  {!collapsed && <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600', letterSpacing: '0.5px' }}>SYSTEM status</span>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: collapsed ? 'center' : 'flex-start' }}>
                    <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)' }}></span>
                    {!collapsed && <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-primary)' }}>Stellar Testnet</span>}
                  </div>
                </div>
              </aside>

              {/* Mobile Bottom Navigation (Responsive convert) */}
              <nav className="mobile-nav">
                <Link href="/dashboard" className={`mobile-nav-link ${pathname === '/dashboard' ? 'active' : ''}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="9" rx="1" />
                    <rect x="14" y="3" width="7" height="5" rx="1" />
                    <rect x="14" y="12" width="7" height="9" rx="1" />
                    <rect x="3" y="16" width="7" height="5" rx="1" />
                  </svg>
                  <span>Overview</span>
                </Link>
                <Link href="/recipients" className={`mobile-nav-link ${pathname === '/recipients' ? 'active' : ''}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                  <span>Recipients</span>
                </Link>
                <Link href="/vaults" className={`mobile-nav-link ${pathname === '/vaults' ? 'active' : ''}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                  </svg>
                  <span>Vaults</span>
                </Link>
                <Link href="/ledger" className={`mobile-nav-link ${pathname === '/ledger' ? 'active' : ''}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                  <span>Ledger</span>
                </Link>
                <Link href="/settings" className={`mobile-nav-link ${pathname === '/settings' ? 'active' : ''}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span>Settings</span>
                </Link>
              </nav>
            </>
          )}

          {/* Main Content Area */}
          <div 
            className="main-content-area"
            style={{ 
              flex: 1, 
              marginLeft: hideSidebar ? '0' : (collapsed ? '80px' : '260px'), 
              padding: hideSidebar ? '0' : '40px 48px',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
