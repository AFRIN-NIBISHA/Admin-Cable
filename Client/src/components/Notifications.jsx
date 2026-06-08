import React, { useState } from 'react';
import CustomSelect from './CustomSelect';
import { Bell, Send, CheckCircle2, Clock, Mail, ShieldAlert, Award, AlertTriangle } from 'lucide-react';

export default function Notifications({ 
  broadcasts, 
  onSendBroadcast 
}) {
  const [activeTab, setActiveTab] = useState('general');
  const [subject, setSubject] = useState('');
  const [target, setTarget] = useState('All Operators');
  const [gateway, setGateway] = useState('SMS Gateway');
  const [body, setBody] = useState('');

  // Maintenance alert states
  const [maintDate, setMaintDate] = useState('2026-06-10');
  const [maintTime, setMaintTime] = useState('02:00');
  const [maintDuration, setMaintDuration] = useState('3');
  const [maintRegions, setMaintRegions] = useState('All Regions');

  // Promotional campaign states
  const [promoTitle, setPromoTitle] = useState('Upgrade Special Discount');
  const [promoOffer, setPromoOffer] = useState('Get Premium HD Tamil channels at 20% off for 6 months.');
  const [promoTarget, setPromoTarget] = useState('Expired Customers');

  const handleSendGeneral = (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;

    onSendBroadcast({
      title: subject,
      target: target,
      gateway: gateway,
      message: body,
      time: "Just now",
      status: "Delivered",
      category: "General Broadcast"
    });

    setSubject('');
    setBody('');
  };

  const handleSendMaintenance = (e) => {
    e.preventDefault();
    const startTime = `${maintDate} ${maintTime}`;
    const message = `SkyLink Notice: Scheduled technical alignment maintenance planned for ${maintRegions} on ${maintDate} at ${maintTime} for approximately ${maintDuration} hours. Feeds may be temporarily unavailable.`;

    onSendBroadcast({
      title: `Maintenance Alert: ${maintRegions}`,
      target: maintRegions,
      gateway: 'SMS Gateway',
      message: message,
      time: "Just now",
      status: "Delivered",
      category: "Maintenance Alert"
    });
  };

  const handleSendPromotional = (e) => {
    e.preventDefault();
    const message = `Promo Special Offer: ${promoTitle}! ${promoOffer} Contact your operator to claim. T&C Apply.`;

    onSendBroadcast({
      title: `Promo: ${promoTitle}`,
      target: promoTarget,
      gateway: 'WhatsApp Gateway',
      message: message,
      time: "Just now",
      status: "Delivered",
      category: "Promotional Offer"
    });
  };

  return (
    <div>
      
      <div className="content-layout">
        
        {/* Left Side: Dynamic Dispatchers */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--border-light)', flexWrap: 'wrap' }}>
              <button 
                className="btn" 
                onClick={() => setActiveTab('general')}
                style={{ 
                  borderRadius: 0, padding: '16px 24px', 
                  borderBottom: activeTab === 'general' ? '3px solid var(--primary)' : '3px solid transparent',
                  color: activeTab === 'general' ? 'var(--primary)' : 'var(--text-secondary)',
                  backgroundColor: activeTab === 'general' ? 'white' : 'transparent',
                  fontWeight: activeTab === 'general' ? '700' : '500'
                }}
              >
                <Mail size={16} /> Broadcast Notification
              </button>
              
              <button 
                className="btn" 
                onClick={() => setActiveTab('maintenance')}
                style={{ 
                  borderRadius: 0, padding: '16px 24px', 
                  borderBottom: activeTab === 'maintenance' ? '3px solid var(--primary)' : '3px solid transparent',
                  color: activeTab === 'maintenance' ? 'var(--primary)' : 'var(--text-secondary)',
                  backgroundColor: activeTab === 'maintenance' ? 'white' : 'transparent',
                  fontWeight: activeTab === 'maintenance' ? '700' : '500'
                }}
              >
                <AlertTriangle size={16} /> Maintenance Alert
              </button>

              <button 
                className="btn" 
                onClick={() => setActiveTab('promo')}
                style={{ 
                  borderRadius: 0, padding: '16px 24px', 
                  borderBottom: activeTab === 'promo' ? '3px solid var(--primary)' : '3px solid transparent',
                  color: activeTab === 'promo' ? 'var(--primary)' : 'var(--text-secondary)',
                  backgroundColor: activeTab === 'promo' ? 'white' : 'transparent',
                  fontWeight: activeTab === 'promo' ? '700' : '500'
                }}
              >
                <Award size={16} /> Promotional Messages
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              {activeTab === 'general' && (
                <form onSubmit={handleSendGeneral} className="tab-panel-enter">
                  <div className="form-group">
                    <label className="form-label">Broadcast Subject *</label>
                    <input 
                      type="text" className="form-input" placeholder="e.g. GST Cycle Closure Reminder" 
                      value={subject} onChange={(e) => setSubject(e.target.value)} required 
                    />
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Recipient Segment *</label>
                      <CustomSelect 
                        options={[
                          { value: "All Operators", label: "All Cable Operators" },
                          { value: "All Customers", label: "All Customer Lines" }
                        ]}
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">API Gateway Provider *</label>
                      <CustomSelect 
                        options={[
                          { value: "SMS Gateway", label: "SMS Webhook (Twilio)" },
                          { value: "WhatsApp Gateway", label: "WhatsApp Cloud API (Meta)" }
                        ]}
                        value={gateway}
                        onChange={(e) => setGateway(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message Body *</label>
                    <textarea 
                      className="form-textarea" placeholder="Type notification body here..." 
                      value={body} onChange={(e) => setBody(e.target.value)} required 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', gap: '8px' }}>
                    <Send size={16} /> Dispatch Broadcast
                  </button>
                </form>
              )}

              {activeTab === 'maintenance' && (
                <form onSubmit={handleSendMaintenance} className="tab-panel-enter">
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Maintenance Date *</label>
                      <input type="date" className="form-input" value={maintDate} onChange={(e) => setMaintDate(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Start Time (24h format) *</label>
                      <input type="time" className="form-input" value={maintTime} onChange={(e) => setMaintTime(e.target.value)} required />
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Expected Duration (Hours)</label>
                      <input type="number" min="1" className="form-input" value={maintDuration} onChange={(e) => setMaintDuration(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Affected Areas / Operators *</label>
                      <CustomSelect 
                        options={[
                          { value: "All Regions", label: "All Service Regions" },
                          { value: "Velachery Region", label: "Velachery Hub Only" },
                          { value: "Adyar Region", label: "Adyar Hub Only" }
                        ]}
                        value={maintRegions}
                        onChange={(e) => setMaintRegions(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ padding: '16px', backgroundColor: 'var(--warning-light)', border: '1px solid var(--warning)', borderRadius: '8px', color: 'var(--warning-dark)', fontSize: '0.8rem', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '20px' }}>
                    <ShieldAlert size={18} style={{ flexShrink: 0 }} />
                    <span>Downtime alerts are dispatched to operators for technician synchronization.</span>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', gap: '8px' }}>
                    <Send size={16} /> Queue Maintenance Alert
                  </button>
                </form>
              )}

              {activeTab === 'promo' && (
                <form onSubmit={handleSendPromotional} className="tab-panel-enter">
                  <div className="form-group">
                    <label className="form-label">Campaign Promotion Title *</label>
                    <input type="text" className="form-input" value={promoTitle} onChange={(e) => setPromoTitle(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Target Customer Segment *</label>
                    <CustomSelect 
                      options={[
                        { value: "Expired Customers", label: "Expired Customers (Re-engagement Campaign)" },
                        { value: "Active Customers", label: "Active Customers (Upsell Campaign)" },
                        { value: "All Operators", label: "All Operators (Discount License Campaign)" }
                      ]}
                      value={promoTarget}
                      onChange={(e) => setPromoTarget(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Promo Details Offer *</label>
                    <textarea className="form-textarea" value={promoOffer} onChange={(e) => setPromoOffer(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', gap: '8px' }}>
                    <Send size={16} /> Send Promotional Broadcast
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

        {/* Right Side: Dispatch history */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card" style={{ marginBottom: 0, padding: '24px 0 0 0', overflow: 'hidden' }}>
            <div style={{ padding: '0 24px 16px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={18} className="text-secondary" />
              <h2 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Dispatched Message History</h2>
            </div>
            
            <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '0 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {broadcasts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-secondary)' }}>
                  No messages dispatched this session.
                </div>
              ) : (
                broadcasts.map((b) => (
                  <div key={b.id} style={{ backgroundColor: 'var(--border-light)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-main)' }}>{b.title}</span>
                      <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{b.category || 'General'}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', lineHeight: '1.4' }}>
                      {b.message}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      <span>Target: {b.target}</span>
                      <span>{b.time} via {b.gateway}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
