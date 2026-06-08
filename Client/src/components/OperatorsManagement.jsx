import React, { useState } from 'react';
import { Users, Search, Plus, MapPin, CheckCircle2, XCircle, Edit2, AlertCircle, Phone, Trash2, Eye, UserMinus, ShieldAlert } from 'lucide-react';
import CustomSelect from './CustomSelect';

export default function OperatorsManagement({ 
  operators, 
  plans,
  transactions,
  onAddOperator, 
  onToggleStatus, 
  onSuspendOperator,
  onDeleteOperator,
  onEditOperator 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOp, setSelectedOp] = useState(null);
  const [editingOperator, setEditingOperator] = useState(null);

  // Form states
  const [opName, setOpName] = useState('');
  const [opRegion, setOpRegion] = useState('Velachery');
  const [opState, setOpState] = useState('Tamil Nadu');
  const [opPhone, setOpPhone] = useState('');
  const [opCommission, setOpCommission] = useState('12');
  const [opSubscribers, setOpSubscribers] = useState('100');
  const [opPlanId, setOpPlanId] = useState('');

  const chennaiRegions = ["Velachery", "Adyar", "Tambaram", "Guindy", "T. Nagar", "Madipakkam", "Sholinganallur", "Chromepet"];
  const southernStates = ["Tamil Nadu", "Karnataka", "Andhra Pradesh", "Kerala"];

  const openRegisterModal = () => {
    setEditingOperator(null);
    setOpName('');
    setOpRegion('Velachery');
    setOpState('Tamil Nadu');
    setOpPhone('');
    setOpCommission('12');
    setOpSubscribers('100');
    setOpPlanId(plans[0]?.id || '');
    setIsModalOpen(true);
  };

  const openEditModal = (op) => {
    setEditingOperator(op);
    setOpName(op.name);
    setOpRegion(op.region);
    setOpState(op.state || 'Tamil Nadu');
    setOpPhone(op.phone || '');
    setOpCommission(op.commission.toString());
    setOpSubscribers(op.subscribers.toString());
    setOpPlanId(op.saasPlanId || '');
    setIsModalOpen(true);
  };

  const openDetailsModal = (op) => {
    setSelectedOp(op);
    setIsDetailsOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!opName.trim() || !opPhone.trim()) {
      alert("Please fill in name and phone.");
      return;
    }

    const planIdNumeric = parseInt(opPlanId, 10);
    const plan = plans.find(p => p.id === planIdNumeric);

    const operatorPayload = {
      name: opName,
      region: opRegion,
      state: opState,
      phone: opPhone,
      commission: parseFloat(opCommission),
      subscribers: parseInt(opSubscribers, 10),
      saasPlanId: planIdNumeric || null,
      saasPlanName: plan ? plan.name : 'No SaaS Plan',
      status: editingOperator ? editingOperator.status : 'Active'
    };

    if (editingOperator) {
      onEditOperator(editingOperator.id, operatorPayload);
    } else {
      onAddOperator(operatorPayload);
    }

    setIsModalOpen(false);
  };

  // Filter and search
  const filteredOperators = operators.filter(op => {
    const matchesSearch = op.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          op.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || op.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      
      {/* Control Header Card */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '280px' }}>
            <div className="search-bar" style={{ display: 'flex', width: '100%', maxWidth: '360px' }}>
              <Search size={16} className="text-secondary" />
              <input 
                type="text" 
                placeholder="Search operator name or region..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <CustomSelect 
              options={[
                { value: "All", label: "All Statuses" },
                { value: "Active", label: "Active Only" },
                { value: "Suspended", label: "Suspended Only" },
                { value: "Inactive", label: "Inactive Only" }
              ]}
              style={{ width: '160px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" onClick={openRegisterModal}>
            <Plus size={16} /> Add Operator
          </button>
        </div>
      </div>

      {/* Operators Grid Table */}
      <div className="card" style={{ padding: '24px 0px 0px 0px', overflow: 'hidden' }}>
        <div style={{ padding: '0 24px 16px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={18} className="text-secondary" />
          <h2 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Active Cable Operators Database</h2>
        </div>
        
        <div className="table-wrapper" style={{ borderLeft: 'none', borderRight: 'none', borderBottom: 'none', borderRadius: 0, margin: 0 }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Operator Name</th>
                <th>Assigned region / State</th>
                <th>Registered Phone</th>
                <th style={{ textAlign: 'center' }}>Active Customers</th>
                <th>SaaS Plan</th>
                <th>Sync Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOperators.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
                    <AlertCircle size={32} style={{ margin: '0 auto 8px auto', display: 'block', opacity: 0.3 }} />
                    No cable operators registered matching criteria.
                  </td>
                </tr>
              ) : (
                filteredOperators.map((op) => (
                  <tr key={op.id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{op.name}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} className="text-secondary" />
                          <span>{op.region}</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                          {op.state || "Tamil Nadu"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                        <Phone size={12} className="text-secondary" />
                        <span>{op.phone}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: '600' }}>
                      {op.subscribers}
                    </td>
                    <td>
                      <span className="badge badge-info">{op.saasPlanName || "No active plan"}</span>
                    </td>
                    <td>
                      {op.status === 'Active' ? (
                        <span className="badge badge-success" style={{ gap: '4px' }}>
                          <CheckCircle2 size={12} /> Active
                        </span>
                      ) : op.status === 'Suspended' ? (
                        <span className="badge badge-warning" style={{ gap: '4px', backgroundColor: 'var(--warning-light)', color: 'var(--warning-dark)' }}>
                          <ShieldAlert size={12} /> Suspended
                        </span>
                      ) : (
                        <span className="badge badge-danger" style={{ gap: '4px' }}>
                          <XCircle size={12} /> Inactive
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button 
                          className="btn btn-outline btn-sm" 
                          onClick={() => openDetailsModal(op)}
                          title="View Details"
                          style={{ padding: '6px' }}
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          className="btn btn-outline btn-sm" 
                          onClick={() => openEditModal(op)}
                          title="Edit Details"
                          style={{ padding: '6px' }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          className={`btn btn-sm ${op.status === 'Suspended' ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => onSuspendOperator(op.id)}
                          style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                          title={op.status === 'Suspended' ? "Activate operator license" : "Suspend operator license"}
                        >
                          {op.status === 'Suspended' ? "Unsuspend" : "Suspend"}
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => { if(confirm(`Confirm delete operator ${op.name}?`)) onDeleteOperator(op.id); }}
                          style={{ padding: '6px' }}
                          title="Delete Operator"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operator Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{editingOperator ? "Edit Operator Details" : "Add Operator"}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Operator Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Enter full name" 
                    value={opName}
                    onChange={(e) => setOpName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Service State *</label>
                    <CustomSelect 
                      options={southernStates.map(st => ({ value: st, label: st }))}
                      value={opState}
                      onChange={(e) => setOpState(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Service Region Area *</label>
                    <CustomSelect 
                      options={chennaiRegions.map(r => ({ value: r, label: r }))}
                      value={opRegion}
                      onChange={(e) => setOpRegion(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Contact Mobile *</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      placeholder="+91 XXXXX XXXXX" 
                      value={opPhone}
                      onChange={(e) => setOpPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Assign Initial SaaS Plan</label>
                    <CustomSelect 
                      options={[
                        { value: "", label: "-- No SaaS Plan --" },
                        ...plans.map(p => ({ value: p.id.toString(), label: `${p.name} (₹${p.price}/mo)` }))
                      ]}
                      value={opPlanId ? opPlanId.toString() : ""}
                      onChange={(e) => setOpPlanId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Commission Rate (%)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      min="1" 
                      max="50" 
                      value={opCommission}
                      onChange={(e) => setOpCommission(e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Customers Managed</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      min="0" 
                      value={opSubscribers}
                      onChange={(e) => setOpSubscribers(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingOperator ? "Update Profile" : "Add Operator"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Operator View Details Modal */}
      {isDetailsOpen && selectedOp && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3 className="modal-title">View Operator Details</h3>
              <button onClick={() => setIsDetailsOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>&times;</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{selectedOp.name}</h4>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>ID: OP-00{selectedOp.id}</span>
                </div>
                <span className={`badge ${selectedOp.status === 'Active' ? 'badge-success' : selectedOp.status === 'Suspended' ? 'badge-warning' : 'badge-danger'}`}>
                  {selectedOp.status}
                </span>
              </div>

              <div className="form-grid" style={{ marginBottom: '24px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block' }}>CONTACT PHONE</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{selectedOp.phone}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block' }}>LOCATION REGION</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{selectedOp.region} ({selectedOp.state || 'Tamil Nadu'})</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block' }}>CUSTOMERS MANAGED</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{selectedOp.subscribers} active lines</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block' }}>COMMISSION RATE</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{selectedOp.commission}% split</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '12px' }}>SaaS Subscription Profile</span>
                <div style={{ backgroundColor: 'var(--border-light)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{selectedOp.saasPlanName || "No active SaaS Plan"}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                      Expiry: {selectedOp.saasExpiry || "N/A"}
                    </span>
                  </div>
                  <span className="badge badge-info">SaaS System Link</span>
                </div>
              </div>

              {/* Transactions linked to this operator */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '20px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '12px' }}>Linked Payment Transactions</span>
                <div className="table-wrapper" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                  <table className="custom-table" style={{ fontSize: '0.8rem' }}>
                    <thead>
                      <tr>
                        <th>Receipt</th>
                        <th>Date</th>
                        <th>Payment Mode</th>
                        <th style={{ textAlign: 'right' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.filter(t => t.operatorName === selectedOp.name).length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: '16px', color: 'var(--text-secondary)' }}>
                            No logged transactions matching operator.
                          </td>
                        </tr>
                      ) : (
                        transactions.filter(t => t.operatorName === selectedOp.name).map(t => (
                          <tr key={t.id}>
                            <td style={{ fontWeight: '600' }}>{t.receiptId}</td>
                            <td>{t.dateTime}</td>
                            <td>{t.mode}</td>
                            <td style={{ textAlign: 'right', fontWeight: '700' }}>₹{t.amount.toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={() => setIsDetailsOpen(false)}>Close View</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
