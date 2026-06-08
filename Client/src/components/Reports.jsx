import React, { useState } from 'react';
import CustomSelect from './CustomSelect';
import { FileText, Download, Calendar, Printer, BarChart2, IndianRupee, MapPin, Users } from 'lucide-react';

export default function Reports({ transactions, operators }) {
  const [reportType, setReportType] = useState('revenue');
  const [startDate, setStartDate] = useState('2026-06-01');
  const [endDate, setEndDate] = useState('2026-06-30');
  const [reportGenerated, setReportGenerated] = useState(true);

  // Compute live billing totals
  const totalBilling = transactions.reduce((sum, t) => sum + t.amount, 0);
  const saasRevenue = transactions.filter(t => t.type === 'SaaS Subscription').reduce((sum, t) => sum + t.amount, 0);
  const operatorRevenue = transactions.filter(t => t.type === 'Operator Collections').reduce((sum, t) => sum + t.amount, 0);

  // State calculations for Customer Reports
  const stateSummary = {};
  operators.forEach(op => {
    const state = op.state || 'Tamil Nadu';
    if (!stateSummary[state]) stateSummary[state] = 0;
    stateSummary[state] += op.subscribers;
  });

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    setReportGenerated(true);
  };

  return (
    <div>
      
      {/* Parameter Selection Cards */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Calendar size={18} className="text-secondary" />
            Select Audit Report Type
          </h2>
        </div>
        <form onSubmit={handleGenerate} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '220px' }}>
            <label className="form-label">Report Category</label>
            <CustomSelect 
              options={[
                { value: "revenue", label: "Revenue Audit Reports (Collections & SaaS Sales)" },
                { value: "customer", label: "Customer Analytics Reports (States & Demographics)" },
                { value: "operator", label: "Operator Performance Reports (Commissions & Plans)" }
              ]}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0, width: '160px' }}>
            <label className="form-label">Start Billing Cycle</label>
            <input 
              type="date" className="form-input"
              value={startDate} onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0, width: '160px' }}>
            <label className="form-label">End Billing Cycle</label>
            <input 
              type="date" className="form-input"
              value={endDate} onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Compile Report
          </button>
        </form>
      </div>

      {/* Generated Report Output */}
      {reportGenerated && (
        <div className="card" style={{ padding: '36px', border: '1px dashed var(--text-secondary)', backgroundColor: '#fff', color: '#000' }}>
          
          {/* Print Sheet Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '20px', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '1.45rem', fontWeight: '800', letterSpacing: '-0.5px' }}>SKYLINK CABLE NETWORK</h1>
              <span style={{ fontSize: '0.8rem', color: '#334155', display: 'block' }}>GSTIN: 33AAAAA0000A1Z2 | Regional Headquarters: Guindy, Chennai</span>
              <span style={{ fontSize: '0.8rem', color: '#334155', display: 'block' }}>Email: compliance@skylinkcable.in</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-info" style={{ marginBottom: '6px' }}>SYSTEM AUDIT RECORD</span>
              <span style={{ fontSize: '0.8rem', display: 'block', fontWeight: '600' }}>Cycle: {startDate} to {endDate}</span>
              <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-secondary)' }}>Generated: 2026-06-07 18:33</span>
            </div>
          </div>

          {/* 1. Revenue Reports */}
          {reportType === 'revenue' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase' }}>
                Gross Revenue & SaaS Subscriptions Audit Sheet
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block' }}>TOTAL GROSS REVENUE</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>{formatINR(totalBilling)}</span>
                </div>
                <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block' }}>SAAS LICENSING BILLS</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--success)' }}>{formatINR(saasRevenue)}</span>
                </div>
                <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block' }}>OPERATOR SPLITS COLLECTED</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--warning)' }}>{formatINR(operatorRevenue)}</span>
                </div>
              </div>

              <div className="table-wrapper" style={{ border: '1px solid #000' }}>
                <table className="custom-table" style={{ fontSize: '0.825rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #000' }}>
                      <th style={{ color: '#000', backgroundColor: '#f1f5f9' }}>Receipt ID</th>
                      <th style={{ color: '#000', backgroundColor: '#f1f5f9' }}>Operator / Payee</th>
                      <th style={{ color: '#000', backgroundColor: '#f1f5f9' }}>Billing Category</th>
                      <th style={{ color: '#000', backgroundColor: '#f1f5f9' }}>Method</th>
                      <th style={{ color: '#000', backgroundColor: '#f1f5f9', textAlign: 'right' }}>Amount Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '16px', color: 'var(--text-secondary)' }}>No transactions logged.</td>
                      </tr>
                    ) : (
                      transactions.map(txn => (
                        <tr key={txn.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ fontWeight: '700' }}>{txn.receiptId}</td>
                          <td>{txn.operatorName}</td>
                          <td>{txn.type}</td>
                          <td>{txn.mode}</td>
                          <td style={{ textAlign: 'right', fontWeight: '700' }}>{formatINR(txn.amount)}</td>
                        </tr>
                      ))
                    )}
                    <tr style={{ borderTop: '2px solid #000', fontWeight: '800' }}>
                      <td colSpan="4" style={{ textAlign: 'right', padding: '12px 16px' }}>TOTAL AUDITED REVENUE:</td>
                      <td style={{ textAlign: 'right', padding: '12px 16px' }}>{formatINR(totalBilling)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. Customer Reports */}
          {reportType === 'customer' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase' }}>
                Customer States Distribution & Demographics Ledger
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '12px' }}>State-wise Subscriber Split</span>
                  <div className="table-wrapper" style={{ border: '1px solid #000' }}>
                    <table className="custom-table" style={{ fontSize: '0.825rem' }}>
                      <thead>
                        <tr>
                          <th style={{ color: '#000', backgroundColor: '#f1f5f9' }}>State</th>
                          <th style={{ color: '#000', backgroundColor: '#f1f5f9', textAlign: 'right' }}>Subscribers Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(stateSummary).length === 0 ? (
                          <tr>
                            <td colSpan="2" style={{ textAlign: 'center', padding: '16px' }}>No mapping available.</td>
                          </tr>
                        ) : (
                          Object.keys(stateSummary).map(state => (
                            <tr key={state}>
                              <td style={{ fontWeight: '600' }}>{state}</td>
                              <td style={{ textAlign: 'right', fontWeight: '700' }}>{stateSummary[state].toLocaleString()}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '12px' }}>Operator Subscriber Holdings</span>
                  <div className="table-wrapper" style={{ border: '1px solid #000' }}>
                    <table className="custom-table" style={{ fontSize: '0.825rem' }}>
                      <thead>
                        <tr>
                          <th style={{ color: '#000', backgroundColor: '#f1f5f9' }}>Operator</th>
                          <th style={{ color: '#000', backgroundColor: '#f1f5f9', textAlign: 'right' }}>Active Customers</th>
                        </tr>
                      </thead>
                      <tbody>
                        {operators.length === 0 ? (
                          <tr>
                            <td colSpan="2" style={{ textAlign: 'center', padding: '16px' }}>No operators registered.</td>
                          </tr>
                        ) : (
                          operators.map(op => (
                            <tr key={op.id}>
                              <td style={{ fontWeight: '600' }}>{op.name}</td>
                              <td style={{ textAlign: 'right', fontWeight: '700' }}>{op.subscribers.toLocaleString()}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Operator Reports */}
          {reportType === 'operator' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase' }}>
                Operator Settings, Commissions & Plan Status Audit
              </h3>

              <div className="table-wrapper" style={{ border: '1px solid #000' }}>
                <table className="custom-table" style={{ fontSize: '0.825rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #000' }}>
                      <th style={{ color: '#000', backgroundColor: '#f1f5f9' }}>Operator Line</th>
                      <th style={{ color: '#000', backgroundColor: '#f1f5f9' }}>Coverage Region</th>
                      <th style={{ color: '#000', backgroundColor: '#f1f5f9' }}>SaaS Plan</th>
                      <th style={{ color: '#000', backgroundColor: '#f1f5f9', textAlign: 'center' }}>Split %</th>
                      <th style={{ color: '#000', backgroundColor: '#f1f5f9', textAlign: 'center' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {operators.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '16px' }}>No operator profiles configured.</td>
                      </tr>
                    ) : (
                      operators.map(op => (
                        <tr key={op.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ fontWeight: '600' }}>{op.name}</td>
                          <td>{op.region} ({op.state || 'Tamil Nadu'})</td>
                          <td>{op.saasPlanName || 'No SaaS Plan'}</td>
                          <td style={{ textAlign: 'center', fontWeight: '700' }}>{op.commission}%</td>
                          <td style={{ textAlign: 'center' }}>
                            <span style={{ fontWeight: '600' }}>{op.status}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button className="btn btn-outline" onClick={() => window.print()} style={{ color: '#000', borderColor: '#000' }}>
              <Printer size={16} /> Print Report
            </button>
            <button className="btn btn-primary" onClick={() => alert("CSV Export complete.")}>
              <Download size={16} /> Export CSV Ledger
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
