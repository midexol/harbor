'use client';

import React, { useState } from 'react';

export default function HarborSettings() {
  const [profileName, setProfileName] = useState("John Doe");
  const [profileEmail, setProfileEmail] = useState("john.doe@harbor.bank");
  
  // Security states
  const [tfaEnabled, setTfaEnabled] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  // API key states
  const [apiKey, setApiKey] = useState("hb_live_948f7d983ae47629b3fd8a");
  const [revealKey, setRevealKey] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Notification toggles
  const [notifyACH, setNotifyACH] = useState(true);
  const [notifyFail, setNotifyFail] = useState(true);

  // Confirmation Modals State
  const [activeModal, setActiveModal] = useState<'disconnect' | 'delete' | null>(null);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRegenerateKey = () => {
    const randomHex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setApiKey(`hb_live_${randomHex}`);
  };

  const handleConfirmAction = () => {
    // Execute simulated action
    setActiveModal(null);
    alert("Action executed successfully.");
  };

  return (
    <div style={{ maxWidth: '780px', position: 'relative' }}>
      
      {/* Top Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: '700', fontSize: '32px', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          System Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Configure your user profile parameters, secure your account, and manage API webhook integrations.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Profile Section (with Avatar simulation) */}
        <div className="glass-panel">
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: 'var(--text-primary)' }}>
            Profile Details
          </h2>
          
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '24px' }}>
            {/* Avatar block */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--color-gold-light)',
              border: '2px solid var(--color-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '20px',
              color: 'var(--color-gold-hover)'
            }}>
              JD
            </div>
            <div>
              <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                Upload Avatar
              </button>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                SVG, PNG, or JPG. Max 2MB.
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Legal Name</label>
              <input 
                type="text" 
                value={profileName} 
                onChange={(e) => setProfileName(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Email Address</label>
              <input 
                type="text" 
                value={profileEmail} 
                onChange={(e) => setProfileEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Security Section (Password & 2FA) */}
        <div className="glass-panel">
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: 'var(--text-primary)' }}>
            Security & Authentication
          </h2>
          
          {/* Two-Factor Authentication Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid var(--border-light)', marginBottom: '20px' }}>
            <div>
              <span style={{ fontWeight: '600', fontSize: '14.5px', display: 'block' }}>Two-Factor Authentication (2FA)</span>
              <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>Add an extra layer of protection using authenticator tokens.</span>
            </div>
            <input 
              type="checkbox" 
              checked={tfaEnabled}
              onChange={(e) => setTfaEnabled(e.target.checked)}
              style={{ width: '40px', height: '20px', accentColor: 'var(--color-gold)', cursor: 'pointer' }}
            />
          </div>

          {/* Change Password form */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Current Password</label>
              <input 
                type="text" 
                value={oldPassword} 
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                style={{ WebkitTextSecurity: 'disc' } as any}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>New Password</label>
              <input 
                type="text" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                style={{ WebkitTextSecurity: 'disc' } as any}
              />
            </div>
          </div>
        </div>

        {/* API Tokens Section */}
        <div className="glass-panel">
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>
            Developer Access Credentials
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
            Integrate Harbor bank proxy routing directly into your own ERP pipelines using REST webhook endpoints.
          </p>

          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>API Key Token</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input 
                type="text" 
                value={revealKey ? apiKey : '••••••••••••••••••••••••••••••••'} 
                readOnly
                style={{ fontFamily: 'monospace', background: '#fdfaf6', letterSpacing: revealKey ? '0' : '2px' }}
              />
              <button className="btn btn-secondary" onClick={() => setRevealKey(!revealKey)}>
                {revealKey ? "Hide" : "Reveal"}
              </button>
              <button className="btn btn-secondary" onClick={handleCopyKey}>
                {isCopied ? "Copied" : "Copy"}
              </button>
              <button className="btn btn-secondary" onClick={handleRegenerateKey} style={{ color: 'var(--color-gold-hover)' }}>
                Regenerate
              </button>
            </div>
          </div>
        </div>

        {/* Notification preferences */}
        <div className="glass-panel">
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
            Notification Channels
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={notifyACH} 
                onChange={(e) => setNotifyACH(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--color-gold)' }}
              />
              Email receipts on completed ACH wire tokenization clearing events.
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={notifyFail} 
                onChange={(e) => setNotifyFail(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--color-gold)' }}
              />
              Slack webhook triggers on payout off-ramp failures.
            </label>
          </div>
        </div>

        {/* Danger Zone - Visually Separated with Muted-Red Border */}
        <div className="glass-panel" style={{ borderColor: '#fca5a5', background: 'rgba(254, 242, 242, 0.4)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: 'var(--color-error)' }}>
            Danger Zone
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Irreversible account admin actions. Once triggered, all virtual account parameters are deleted.
          </p>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn btn-secondary" onClick={() => setActiveModal('disconnect')} style={{ color: 'var(--color-error)', borderColor: '#ffd8d6' }}>
              Disconnect Wallet
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveModal('delete')} style={{ color: 'white', background: 'var(--color-error)' }}>
              Delete Account
            </button>
          </div>
        </div>

      </div>

      {/* Confirmation Modal Overlay */}
      {activeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 30, 54, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: 'var(--color-error)' }}>
              Confirm Action
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
              Are you sure you want to {activeModal === 'disconnect' ? 'disconnect your Freighter Wallet configuration' : 'completely delete your Harbor account profile'}? This operation is permanent and cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleConfirmAction} style={{ background: 'var(--color-error)', color: 'white' }}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
