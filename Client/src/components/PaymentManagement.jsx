import React, { useState } from 'react';
import CustomSelect from './CustomSelect';
import { CreditCard, Search, Plus, Filter, Calendar, MapPin, IndianRupee, Printer, FileText, Download } from 'lucide-react';

export default function PaymentManagement({ 
  transactions, 
  operators, 
  plans,
  onAddTransaction 
}) {
  const [activeTab, setActiveTab] = useState('collections');
  const [searchTerm, setSearchTerm] = useState('');
  const [invoiceTxnId, setInvoiceTxnId] = useState(null);

  // Form states
  const [selectedOperatorId, setSelectedOperatorId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [paymentType, setPaymentType] = useState('Operator Collections');

  const handleRecordPayment = (e) => {
    e.preventDefault();
    if (!selectedOperatorId || !paymentAmount) {
      alert("Please select operator and amount.");
      return;
    }

    const operator = operators.find(op => op.id === parseInt(selectedOperatorId, 10));
    if (!operator) return;

    const newTxn = {
      operatorName: operator.name,
      region: operator.region,
      amount: parseFloat(paymentAmount),
      mode: paymentMode,
      type: paymentType, // "Operator Collections" or "SaaS Subscription"
      status: 'Paid'
    };

    onAddTransaction(newTxn);
    setSelectedOperatorId('');
    setPaymentAmount('');
  };

  const filteredTxns = transactions.filter(txn => {
    const matchesSearch = txn.operatorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          txn.receiptId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'collections' 
      ? txn.type === 'Operator Collections' 
      : txn.type === 'SaaS Subscription';
    return matchesSearch && matchesTab;
  });

  const selectedInvoiceTxn = transactions.find(t => t.id === invoiceTxnId);

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
            onClick={() => { setActiveTab('collections'); setInvoiceTxnId(null); }}
            style={{ 
              borderRadius: 0, padding: '16px 24px', 
              borderBottom: activeTab === 'collections' && !invoiceTxnId ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'collections' && !invoiceTxnId ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: activeTab === 'collections' && !invoiceTxnId ? 'white' : 'transparent',
              fontWeight: activeTab === 'collections' && !invoiceTxnId ? '700' : '500'
            }}
          >
            <CreditCard size={16} /> Operator Collections Ledger
          </button>
          
          <button 
            className="btn" 
            onClick={() => { setActiveTab('saas'); setInvoiceTxnId(null); }}
            style={{ 
              borderRadius: 0, padding: '16px 24px', 
              borderBottom: activeTab === 'saas' && !invoiceTxnId ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'saas' && !invoiceTxnId ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: activeTab === 'saas' && !invoiceTxnId ? 'white' : 'transparent',
              fontWeight: activeTab === 'saas' && !invoiceTxnId ? '700' : '500'
            }}
          >
            <Calendar size={16} /> SaaS Subscription History
          </button>
        </div>
      </div>

      {invoiceTxnId && selectedInvoiceTxn ? (
        /* Invoice Details View */
        <div className="card" style={{ padding: '36px', border: '1px solid var(--border-color)', backgroundColor: '#fff', color: '#000', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '20px', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '1.45rem', fontWeight: '800', letterSpacing: '-0.5px' }}>SKYLINK CABLE NETWORK</h1>
              <span style={{ fontSize: '0.8rem', color: '#334155', display: 'block' }}>GSTIN: 33AAAAA0000A1Z2 | Corporate Office: Chennai</span>
              <span style={{ fontSize: '0.8rem', color: '#334155', display: 'block' }}>Email: billing@skylinkcable.in</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-success" style={{ marginBottom: '6px' }}>TAX INVOICE</span>
              <span style={{ fontSize: '0.8rem', display: 'block', fontWeight: '600' }}>Invoice: {selectedInvoiceTxn.receiptId}</span>
              <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-secondary)' }}>Date: {selectedInvoiceTxn.dateTime}</span>
            </div>
          </div>

          <div className="form-grid" style={{ marginBottom: '32px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', display: 'block' }}>BILLED TO:</span>
              <span style={{ fontSize: '0.9rem', fontWeight: '700', display: 'block' }}>{selectedInvoiceTxn.operatorName}</span>
              <span style={{ fontSize: '0.8rem', color: '#475569', display: 'block' }}>Region: {selectedInvoiceTxn.region}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', display: 'block' }}>PAYMENT METHOD:</span>
              <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>{selectedInvoiceTxn.mode}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--success-dark)', display: 'block', fontWeight: '600' }}>STATUS: PAID</span>
            </div>
          </div>

          <table className="custom-table" style={{ border: '1px solid var(--border-color)', fontSize: '0.85rem', marginBottom: '24px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--border-light)' }}>
                <th style={{ color: '#000' }}>Description</th>
                <th style={{ color: '#000' }}>Billing Category</th>
                <th style={{ color: '#000', textAlign: 'right' }}>Taxable Value</th>
                <th style={{ color: '#000', textAlign: 'right' }}>GST (18%)</th>
                <th style={{ color: '#000', textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: '600' }}>
                  {selectedInvoiceTxn.type === 'SaaS Subscription' 
                    ? `Operator SaaS Licensing Service Renewal` 
                    : `Monthly Collection Split Settlement`}
                </td>
                <td>{selectedInvoiceTxn.type}</td>
                <td style={{ textAlign: 'right' }}>{formatINR(Math.round(selectedInvoiceTxn.amount / 1.18))}</td>
                <td style={{ textAlign: 'right' }}>{formatINR(Math.round((selectedInvoiceTxn.amount / 1.18) * 0.18))}</td>
                <td style={{ textAlign: 'right', fontWeight: '700' }}>{formatINR(selectedInvoiceTxn.amount)}</td>
              </tr>
              <tr style={{ borderTop: '2px solid #000', fontWeight: '800' }}>
                <td colSpan="4" style={{ textAlign: 'right', padding: '12px 16px' }}>Total Amount Paid (inclusive of taxes):</td>
                <td style={{ textAlign: 'right', padding: '12px 16px' }}>{formatINR(selectedInvoiceTxn.amount)}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
            <button className="btn btn-outline" onClick={() => setInvoiceTxnId(null)}>Back to Ledger</button>
            <button className="btn btn-primary" onClick={() => window.print()}>
              <Printer size={16} /> Print Invoice
            </button>
          </div>
        </div>
      ) : (
        /* Ledger and Quick Entry Grid */
        <div className="content-layout">
          
          {/* Left Side: Ledger List */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div className="search-bar" style={{ display: 'flex', flex: 1, maxWidth: '300px' }}>
                  <Search size={16} className="text-secondary" />
                  <input 
                    type="text" 
                    placeholder="Search receipt, operator..." 
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="table-wrapper" style={{ margin: 0 }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Receipt ID</th>
                      <th>Operator Name</th>
                      <th>Region Area</th>
                      <th>Amount Paid</th>
                      <th>Payment Mode</th>
                      <th>Txn Timestamp</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTxns.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                          No transactions registered matching criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredTxns.map((txn) => (
                        <tr key={txn.id}>
                          <td style={{ fontWeight: '600' }}>{txn.receiptId}</td>
                          <td>{txn.operatorName}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={12} className="text-secondary" />
                              <span>{txn.region}</span>
                            </div>
                          </td>
                          <td style={{ fontWeight: '700', color: 'var(--text-main)' }}>{formatINR(txn.amount)}</td>
                          <td>
                            <span className="badge badge-success">{txn.mode}</span>
                          </td>
                          <td>{txn.dateTime}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button 
                              className="btn btn-outline btn-sm"
                              style={{ display: 'inline-flex', gap: '4px' }}
                              onClick={() => setInvoiceTxnId(txn.id)}
                            >
                              <FileText size={12} /> Invoice
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Side: Quick Action - Record payment */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <CreditCard size={18} className="text-secondary" />
                  Record Collection / SaaS Payment
                </h2>
              </div>
              <form onSubmit={handleRecordPayment}>
                <div className="form-group">
                  <label className="form-label">Payment Category *</label>
                    <CustomSelect 
                      options={[
                        { value: "Operator Collections", label: "Operator Collections Split" },
                        { value: "SaaS Subscription", label: "Operator SaaS License Payment" }
                      ]}
                      value={paymentType}
                      onChange={(e) => setPaymentType(e.target.value)}
                    />
                </div>

                <div className="form-group">
                  <label className="form-label">Select Operator *</label>
                    <CustomSelect 
                      options={[
                        { value: "", label: "-- Select Operator --" },
                        ...operators.map(op => ({ value: op.id.toString(), label: `${op.name} (${op.region})` }))
                      ]}
                      value={selectedOperatorId ? selectedOperatorId.toString() : ""}
                      onChange={(e) => setSelectedOperatorId(e.target.value)}
                    />
                </div>

                <div className="form-group">
                  <label className="form-label">Billing Amount (INR) *</label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-secondary)' }}>
                      <IndianRupee size={16} />
                    </div>
                    <input 
                      type="number" 
                      className="form-input" 
                      style={{ paddingLeft: '32px' }}
                      placeholder="Enter amount collected"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Mode *</label>
                    <CustomSelect 
                      options={[
                        { value: "UPI", label: "UPI Transfer" },
                        { value: "Cash", label: "Cash Handover" },
                        { value: "NetBanking", label: "Net Banking" }
                      ]}
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                    />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                  Commit Payment Entry
                </button>
              </form>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
