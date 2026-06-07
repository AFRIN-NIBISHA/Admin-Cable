import React, { useState } from 'react';
import CustomSelect from './CustomSelect';
import { Tv, Plus, Edit2, AlertCircle, RefreshCw, ArrowUp, Calendar, Clock, Award, CheckCircle } from 'lucide-react';

export default function SubscriptionManagement({ 
  plans, 
  operators,
  onAddPlan, 
  onEditPlan, 
  onTogglePlanStatus,
  onUpgradePlan,
  onRenewPlan 
}) {
  const [activeSubTab, setActiveSubTab] = useState('plans');
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  // Upgrade/Renew form states
  const [targetOperatorId, setTargetOperatorId] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [renewMonths, setRenewMonths] = useState('1');

  // Plan creation form states
  const [planName, setPlanName] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [customerLimit, setCustomerLimit] = useState('500');
  const [planDesc, setPlanDesc] = useState('');

  const handleCreatePlan = (e) => {
    e.preventDefault();
    if (!planName.trim() || !planPrice.trim()) return;

    const payload = {
      name: planName,
      price: parseFloat(planPrice),
      customerLimit: parseInt(customerLimit, 10),
      description: planDesc,
      status: editingPlan ? editingPlan.status : 'Active',
      subscribers: editingPlan ? editingPlan.subscribers : 0
    };

    if (editingPlan) {
      onEditPlan(editingPlan.id, payload);
    } else {
      onAddPlan(payload);
    }
    setIsPlanModalOpen(false);
  };

  const handleUpgradeAction = (e) => {
    e.preventDefault();
    if (!targetOperatorId || !selectedPlanId) {
      alert("Please select both operator and new SaaS Plan.");
      return;
    }
    onUpgradePlan(parseInt(targetOperatorId, 10), parseInt(selectedPlanId, 10));
    setTargetOperatorId('');
    setSelectedPlanId('');
  };

  const handleRenewAction = (e) => {
    e.preventDefault();
    if (!targetOperatorId || !renewMonths) {
      alert("Please select operator and renewal period.");
      return;
    }
    onRenewPlan(parseInt(targetOperatorId, 10), parseInt(renewMonths, 10));
    setTargetOperatorId('');
  };

  const getDaysRemaining = (expiryDateStr) => {
    if (!expiryDateStr) return -999;
    const expiry = new Date(expiryDateStr);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      
      {/* Sub tabs switcher */}
      <div className="card" style={{ padding: 0, marginBottom: '24px' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--border-light)', flexWrap: 'wrap' }}>
          <button 
            className="btn" 
            onClick={() => setActiveSubTab('plans')}
            style={{ 
              borderRadius: 0, padding: '16px 24px', 
              borderBottom: activeSubTab === 'plans' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeSubTab === 'plans' ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: activeSubTab === 'plans' ? 'white' : 'transparent',
              fontWeight: activeSubTab === 'plans' ? '700' : '500'
            }}
          >
            <Award size={16} /> SaaS Subscription Plans
          </button>
          
          <button 
            className="btn" 
            onClick={() => setActiveSubTab('tracking')}
            style={{ 
              borderRadius: 0, padding: '16px 24px', 
              borderBottom: activeSubTab === 'tracking' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeSubTab === 'tracking' ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: activeSubTab === 'tracking' ? 'white' : 'transparent',
              fontWeight: activeSubTab === 'tracking' ? '700' : '500'
            }}
          >
            <Clock size={16} /> Operator Expiry Tracking
          </button>

          <button 
            className="btn" 
            onClick={() => setActiveSubTab('actions')}
            style={{ 
              borderRadius: 0, padding: '16px 24px', 
              borderBottom: activeSubTab === 'actions' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeSubTab === 'actions' ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: activeSubTab === 'actions' ? 'white' : 'transparent',
              fontWeight: activeSubTab === 'actions' ? '700' : '500'
            }}
          >
            <RefreshCw size={16} /> Upgrade & Renew License
          </button>
        </div>
      </div>

      {/* SaaS Plans Tab */}
      {activeSubTab === 'plans' && (
        <div>
          <div className="card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                Manage licensing packages offered to operators based on customer count limitations.
              </span>
              <button className="btn btn-primary btn-sm" onClick={() => { setEditingPlan(null); setPlanName(''); setPlanPrice(''); setCustomerLimit('500'); setPlanDesc(''); setIsPlanModalOpen(true); }}>
                <Plus size={16} /> Create SaaS Plan
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {plans.length === 0 ? (
              <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
                <AlertCircle size={32} style={{ margin: '0 auto 8px auto', display: 'block', opacity: 0.3 }} />
                No SaaS plans created yet. Click 'Create SaaS Plan' to add one.
              </div>
            ) : (
              plans.map((plan) => (
                <div key={plan.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--primary)' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{plan.name}</h3>
                      <span className="badge badge-info" style={{ height: 'fit-content' }}>SaaS Plan</span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '1.85rem', fontWeight: '800' }}>{formatINR(plan.price)}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>/ month</span>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px', minHeight: '32px' }}>
                      {plan.description}
                    </p>

                    <div style={{ backgroundColor: 'var(--border-light)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '20px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>{plan.customerLimit}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', fontWeight: '600', textTransform: 'uppercase' }}>Customer Limit</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => { setEditingPlan(plan); setPlanName(plan.name); setPlanPrice(plan.price.toString()); setCustomerLimit(plan.customerLimit.toString()); setPlanDesc(plan.description); setIsPlanModalOpen(true); }}>
                      <Edit2 size={12} /> Edit Plan
                    </button>
                    <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={() => onTogglePlanStatus(plan.id)}>
                      {plan.status === 'Active' ? 'Archive' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Expiry Tracking Tab */}
      {activeSubTab === 'tracking' && (
        <div className="card">
          <div style={{ paddingBottom: '16px', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} className="text-secondary" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Operator License Expiry Tracking</h2>
          </div>

          <div className="table-wrapper" style={{ margin: 0 }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Operator Name</th>
                  <th>Region Area</th>
                  <th>Current SaaS Plan</th>
                  <th>Expiry Date</th>
                  <th>Days Remaining</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {operators.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                      No operators found to track.
                    </td>
                  </tr>
                ) : (
                  operators.map(op => {
                    const daysLeft = getDaysRemaining(op.saasExpiry);
                    let statusBadge = <span className="badge badge-success">Active</span>;
                    let daysText = `${daysLeft} days left`;

                    if (op.status === 'Suspended') {
                      statusBadge = <span className="badge badge-warning">Suspended</span>;
                      daysText = "Suspended";
                    } else if (daysLeft <= 0) {
                      statusBadge = <span className="badge badge-danger">Expired</span>;
                      daysText = "Expired";
                    } else if (daysLeft <= 7) {
                      statusBadge = <span className="badge badge-warning">Expiring soon</span>;
                    }

                    return (
                      <tr key={op.id}>
                        <td style={{ fontWeight: '600' }}>{op.name}</td>
                        <td>{op.region} ({op.state || 'Tamil Nadu'})</td>
                        <td>
                          <span className="badge badge-info">{op.saasPlanName || 'No SaaS Plan'}</span>
                        </td>
                        <td>{op.saasExpiry || 'N/A'}</td>
                        <td style={{ fontWeight: '600', color: daysLeft <= 7 && op.status !== 'Suspended' ? 'var(--danger-dark)' : 'inherit' }}>
                          {daysText}
                        </td>
                        <td>{statusBadge}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upgrade & Renew Tab */}
      {activeSubTab === 'actions' && (
        <div className="content-layout">
          
          {/* Upgrade Form */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <ArrowUp size={18} className="text-secondary" />
                Upgrade Operator SaaS Plan
              </h2>
            </div>
            <form onSubmit={handleUpgradeAction}>
              <div className="form-group">
                <label className="form-label">Select Operator *</label>
                <CustomSelect 
                  options={[
                    { value: "", label: "-- Select Operator --" },
                    ...operators.map(op => ({ value: op.id.toString(), label: `${op.name} (Plan: ${op.saasPlanName})` }))
                  ]}
                  value={targetOperatorId ? targetOperatorId.toString() : ""}
                  onChange={(e) => setTargetOperatorId(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Select Upgrade SaaS Package *</label>
                <CustomSelect 
                  options={[
                    { value: "", label: "-- Select Plan --" },
                    ...plans.map(p => ({ value: p.id.toString(), label: `${p.name} (Limit: ${p.customerLimit} Customers, Price: ₹${p.price})` }))
                  ]}
                  value={selectedPlanId ? selectedPlanId.toString() : ""}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Apply SaaS Package Upgrade
              </button>
            </form>
          </div>

          {/* Renew Form */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <RefreshCw size={18} className="text-secondary" />
                Renew SaaS Subscription License
              </h2>
            </div>
            <form onSubmit={handleRenewAction}>
              <div className="form-group">
                <label className="form-label">Select Operator *</label>
                <CustomSelect 
                  options={[
                    { value: "", label: "-- Select Operator --" },
                    ...operators.map(op => ({ value: op.id.toString(), label: `${op.name} (Expires: ${op.saasExpiry || 'Never'})` }))
                  ]}
                  value={targetOperatorId ? targetOperatorId.toString() : ""}
                  onChange={(e) => setTargetOperatorId(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Select Renewal Extension Period *</label>
                <CustomSelect 
                  options={[
                    { value: "1", label: "1 Month Extension" },
                    { value: "3", label: "3 Months Extension" },
                    { value: "6", label: "6 Months Extension" },
                    { value: "12", label: "12 Months (1 Year Extension)" }
                  ]}
                  value={renewMonths}
                  onChange={(e) => setRenewMonths(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Renew SaaS License Snapshot
              </button>
            </form>
          </div>

        </div>
      )}

      {/* Plan Form Modal */}
      {isPlanModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{editingPlan ? "Edit SaaS Plan Details" : "Create SaaS Package Plan"}</h3>
              <button onClick={() => setIsPlanModalOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>&times;</button>
            </div>
            <form onSubmit={handleCreatePlan}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">SaaS Package Name *</label>
                  <input type="text" className="form-input" placeholder="e.g. Bronze Package, Gold Package" value={planName} onChange={(e) => setPlanName(e.target.value)} required />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Monthly Rate (INR) *</label>
                    <input type="number" className="form-input" placeholder="e.g. 1500" value={planPrice} onChange={(e) => setPlanPrice(e.target.value)} required />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Maximum Customer License Limit</label>
                    <input type="number" className="form-input" value={customerLimit} onChange={(e) => setCustomerLimit(e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Package Features Description</label>
                  <textarea className="form-textarea" placeholder="List key limits or modules enabled" value={planDesc} onChange={(e) => setPlanDesc(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsPlanModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingPlan ? "Save SaaS Plan" : "Create SaaS Plan"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
