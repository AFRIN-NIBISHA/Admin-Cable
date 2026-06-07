import React, { useState } from 'react';
import CustomSelect from './CustomSelect';
import { Settings, Save, ShieldAlert, Key, Smartphone, Globe, Landmark, Mail } from 'lucide-react';

export default function SystemSettings({ onSaveSettings }) {
  const [activeTab, setActiveTab] = useState('sms');

  // SMS settings
  const [smsGateway, setSmsGateway] = useState('Twilio SMS Webhook');
  const [smsApiKey, setSmsApiKey] = useState('••••••••••••••••••••••••••••••••');
  const [smsSenderId, setSmsSenderId] = useState('SKYLNK');

  // WhatsApp settings
  const [waEndpoint, setWaEndpoint] = useState('https://graph.facebook.com/v19.0/phone/messages');
  const [waToken, setWaToken] = useState('••••••••••••••••••••••••••••••••••••••••••••••••');

  // Email SMTP settings
  const [smtpServer, setSmtpServer] = useState('smtp.mailgun.org');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('postmaster@skylinkcable.in');
  const [smtpPass, setSmtpPass] = useState('••••••••••••••••••••••••');

  // Payment settings
  const [sandboxMode, setSandboxMode] = useState(true);
  const [merchantKey, setMerchantKey] = useState('rzp_live_SKYLNK90832104');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings("System configurations updated successfully.");
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        
        {/* Settings Tab Headers */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--border-light)', flexWrap: 'wrap' }}>
          
          <button 
            type="button"
            className="btn" 
            onClick={() => setActiveTab('sms')}
            style={{ 
              borderRadius: 0, padding: '16px 24px', 
              borderBottom: activeTab === 'sms' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'sms' ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: activeTab === 'sms' ? 'white' : 'transparent',
              fontWeight: activeTab === 'sms' ? '700' : '500'
            }}
          >
            <Smartphone size={16} /> SMS Gateway
          </button>

          <button 
            type="button"
            className="btn" 
            onClick={() => setActiveTab('wa')}
            style={{ 
              borderRadius: 0, padding: '16px 24px', 
              borderBottom: activeTab === 'wa' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'wa' ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: activeTab === 'wa' ? 'white' : 'transparent',
              fontWeight: activeTab === 'wa' ? '700' : '500'
            }}
          >
            <Globe size={16} /> WhatsApp API
          </button>

          <button 
            type="button"
            className="btn" 
            onClick={() => setActiveTab('email')}
            style={{ 
              borderRadius: 0, padding: '16px 24px', 
              borderBottom: activeTab === 'email' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'email' ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: activeTab === 'email' ? 'white' : 'transparent',
              fontWeight: activeTab === 'email' ? '700' : '500'
            }}
          >
            <Mail size={16} /> Email SMTP Settings
          </button>

          <button 
            type="button"
            className="btn" 
            onClick={() => setActiveTab('billing')}
            style={{ 
              borderRadius: 0, padding: '16px 24px', 
              borderBottom: activeTab === 'billing' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'billing' ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: activeTab === 'billing' ? 'white' : 'transparent',
              fontWeight: activeTab === 'billing' ? '700' : '500'
            }}
          >
            <Landmark size={16} /> Payment Gateway Settings
          </button>
        </div>

        {/* Tab Contents */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          
          {/* 1. SMS Gateway Tab */}
          {activeTab === 'sms' && (
            <div style={{ animation: 'fadeIn 0.2s ease' }}>
              <div className="form-group">
                <label className="form-label">SMS Provider Gateway Endpoint</label>
                <CustomSelect 
                  options={[
                    { value: "Twilio SMS Webhook", label: "Twilio SMS Gateway" },
                    { value: "ValueFirst SMS India", label: "ValueFirst Enterprise SMS Gateway (India)" }
                  ]}
                  value={smsGateway}
                  onChange={(e) => setSmsGateway(e.target.value)}
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">SMS Sender Signature ID</label>
                  <input 
                    type="text" className="form-input" maxLength="6"
                    value={smsSenderId} onChange={(e) => setSmsSenderId(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">API Gateway Secret Authorization Token</label>
                  <input 
                    type="password" className="form-input" 
                    value={smsApiKey} onChange={(e) => setSmsApiKey(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. WhatsApp API Tab */}
          {activeTab === 'wa' && (
            <div style={{ animation: 'fadeIn 0.2s ease' }}>
              <div className="form-group">
                <label className="form-label">Meta Cloud WhatsApp API Endpoint</label>
                <input 
                  type="text" className="form-input" 
                  value={waEndpoint} onChange={(e) => setWaEndpoint(e.target.value)} required
                />
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp Permanent Bearer Token</label>
                <input 
                  type="password" className="form-input" 
                  value={waToken} onChange={(e) => setWaToken(e.target.value)} required
                />
              </div>
            </div>
          )}

          {/* 3. Email Settings Tab */}
          {activeTab === 'email' && (
            <div style={{ animation: 'fadeIn 0.2s ease' }}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">SMTP Server Hostname *</label>
                  <input 
                    type="text" className="form-input" placeholder="smtp.gmail.com" 
                    value={smtpServer} onChange={(e) => setSmtpServer(e.target.value)} required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">SMTP Relaying Port *</label>
                  <input 
                    type="text" className="form-input" placeholder="587" 
                    value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} required
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">SMTP Authentication Username *</label>
                  <input 
                    type="text" className="form-input" 
                    value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">SMTP Authentication Password *</label>
                  <input 
                    type="password" className="form-input" 
                    value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)} required
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. Payment Gateway Settings Tab */}
          {activeTab === 'billing' && (
            <div style={{ animation: 'fadeIn 0.2s ease' }}>
              <div className="form-group">
                <label className="form-label">Collections Gateway API</label>
                <CustomSelect 
                  options={[
                    { value: "Razorpay", label: "Razorpay standard checkout APIs" },
                    { value: "Paytm", label: "Paytm Business checkout SDK" }
                  ]}
                  value="Razorpay"
                  onChange={() => {}}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Production Merchant Key ID</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-secondary)' }}>
                    <Key size={16} />
                  </div>
                  <input 
                    type="text" className="form-input" style={{ paddingLeft: '32px' }}
                    value={merchantKey} onChange={(e) => setMerchantKey(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center', marginTop: '16px' }}>
                <input 
                  type="checkbox" id="sandbox-toggle" style={{ width: '18px', height: '18px' }}
                  checked={sandboxMode} onChange={(e) => setSandboxMode(e.target.checked)}
                />
                <label htmlFor="sandbox-toggle" className="form-label" style={{ cursor: 'pointer', marginBottom: 0 }}>
                  Enable Gateway sandbox (Prevents live credit card transaction postings)
                </label>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div style={{ borderTop: '1px solid var(--border-color)', padding: '16px 0 0 0', display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', gap: '6px' }}>
              <Save size={16} /> Save Settings
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
