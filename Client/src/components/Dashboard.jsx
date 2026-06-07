import React, { useState } from 'react';
import { 
  IndianRupee, 
  Users, 
  Activity, 
  LifeBuoy, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  TrendingUp, 
  Database,
  MapPin,
  AlertCircle,
  Clock,
  UserX,
  CreditCard
} from 'lucide-react';

export default function Dashboard({ 
  setActiveTab, 
  operators, 
  transactions, 
  tickets, 
  activities 
}) {
  const [hoverIndex, setHoverIndex] = useState(null);

  // 1. Total Operators
  const totalOperators = operators.length;

  // 2. Total Customers (Subscribers count)
  const totalCustomers = operators.reduce((acc, curr) => acc + (curr.subscribers || 0), 0);

  // 3. Active Customers (Subscribers under Active operators)
  const activeCustomers = operators
    .filter(op => op.status === 'Active')
    .reduce((acc, curr) => acc + (curr.subscribers || 0), 0);

  // 4. Expired/Suspended Customers
  const expiredCustomers = operators
    .filter(op => op.status === 'Suspended' || op.status === 'Inactive')
    .reduce((acc, curr) => acc + (curr.subscribers || 0), 0);

  // 5. Total Revenue
  const totalRevenue = transactions.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

  // 6. Monthly Revenue (Transactions logged in current month - June 2026)
  const monthlyRevenue = transactions
    .filter(t => t.dateTime.includes('06-2026'))
    .reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

  // 7. Pending Payments (unpaid collections/estimated values)
  const pendingPayments = operators
    .filter(op => op.status === 'Active')
    .reduce((acc, curr) => acc + (curr.subscribers * 50), 0); // simulated ₹50 pending per customer line

  // Dynamic SVG Chart Data - Groups billing ledger by month
  const buildChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const groups = {};
    
    transactions.forEach(t => {
      const parts = t.dateTime.split(' ')[0].split('-');
      if (parts.length === 3) {
        const monthIdx = parseInt(parts[1], 10) - 1;
        const monthName = months[monthIdx];
        if (!groups[monthName]) groups[monthName] = 0;
        groups[monthName] += t.amount;
      }
    });

    const dataPoints = Object.keys(groups).map((month, idx) => ({
      month,
      value: groups[month],
      idx: idx
    })).sort((a, b) => a.idx - b.idx);

    if (dataPoints.length === 0) return [];

    const maxVal = Math.max(...dataPoints.map(d => d.value));
    const stepX = dataPoints.length > 1 ? (350 / (dataPoints.length - 1)) : 350;
    
    return dataPoints.map((d, index) => {
      const x = 50 + index * stepX;
      const y = maxVal > 0 ? 200 - ((d.value / maxVal) * 150) : 200;
      return {
        month: d.month,
        value: d.value,
        x,
        y
      };
    });
  };

  const chartData = buildChartData();

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      
      {/* 7 Stats Cards Section */}
      <div className="stats-grid">
        
        {/* Card 1: Total Operators */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Operators</span>
            <div className="stat-card-icon primary">
              <Users size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-card-value">{totalOperators}</span>
            <span className="stat-card-trend up" style={{ width: 'fit-content' }}>
              <span>Registered lines</span>
            </span>
          </div>
        </div>

        {/* Card 2: Total Customers */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Customers</span>
            <div className="stat-card-icon success">
              <Users size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-card-value">{totalCustomers}</span>
            <span className="stat-card-trend up" style={{ width: 'fit-content' }}>
              <span>Subscriber base</span>
            </span>
          </div>
        </div>

        {/* Card 3: Active Customers */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Active Customers</span>
            <div className="stat-card-icon success">
              <Activity size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-card-value">{activeCustomers}</span>
            <span className="stat-card-trend up" style={{ width: 'fit-content', backgroundColor: 'var(--success-light)', color: 'var(--success-dark)' }}>
              <span>Sync online</span>
            </span>
          </div>
        </div>

        {/* Card 4: Expired Customers */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Expired Customers</span>
            <div className="stat-card-icon info" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
              <UserX size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-card-value">{expiredCustomers}</span>
            <span className="stat-card-trend down" style={{ width: 'fit-content', backgroundColor: 'var(--danger-light)', color: 'var(--danger-dark)' }}>
              <span>Suspended/Inactive</span>
            </span>
          </div>
        </div>

        {/* Card 5: Total Revenue */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Revenue</span>
            <div className="stat-card-icon primary">
              <IndianRupee size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-card-value">{formatINR(totalRevenue)}</span>
            <span className="stat-card-trend up" style={{ width: 'fit-content' }}>
              <span>Cumulative gross</span>
            </span>
          </div>
        </div>

        {/* Card 6: Monthly Revenue */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Monthly Revenue</span>
            <div className="stat-card-icon primary">
              <CreditCard size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-card-value">{formatINR(monthlyRevenue)}</span>
            <span className="stat-card-trend up" style={{ width: 'fit-content' }}>
              <span>Current billing cycle</span>
            </span>
          </div>
        </div>

        {/* Card 7: Pending Payments */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Pending Payments</span>
            <div className="stat-card-icon warning">
              <Clock size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-card-value">{formatINR(pendingPayments)}</span>
            <span className="stat-card-trend down" style={{ width: 'fit-content' }}>
              <span>Outstandings split</span>
            </span>
          </div>
        </div>

      </div>

      {/* Main Charts & Ledger Grid */}
      <div className="content-layout">
        {/* Collection Trend SVG Chart */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h2 className="card-title">
              <TrendingUp size={18} className="text-secondary" />
              Monthly Revenue Performance Trend (INR)
            </h2>
            <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('analytics')}>
              View Insights
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="chart-container">
              {chartData.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '48px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                  <TrendingUp size={36} style={{ opacity: 0.3 }} />
                  <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>No billing collections recorded yet</p>
                  <span style={{ fontSize: '0.75rem' }}>Add active operators and log manual payments to display the revenue curve.</span>
                </div>
              ) : (
                <svg className="chart-svg" viewBox="0 0 450 250">
                  <defs>
                    <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Gridlines */}
                  <line x1="50" y1="50" x2="400" y2="50" className="chart-grid-line" />
                  <line x1="50" y1="100" x2="400" y2="100" className="chart-grid-line" />
                  <line x1="50" y1="150" x2="400" y2="150" className="chart-grid-line" />
                  <line x1="50" y1="200" x2="400" y2="200" className="chart-grid-line" />

                  {/* Dynamic Area under graph */}
                  <path 
                    d={`M 50 200 L ${chartData.map(d => `${d.x} ${d.y}`).join(' L ')} L ${chartData[chartData.length - 1].x} 200 Z`} 
                    fill="url(#chart-gradient)" 
                  />

                  {/* Trend Line */}
                  <path 
                    d={`M ${chartData.map(d => `${d.x} ${d.y}`).join(' L ')}`} 
                    className="chart-line" 
                  />

                  {/* Data Points */}
                  {chartData.map((point, index) => (
                    <g key={index}>
                      <circle 
                        cx={point.x} 
                        cy={point.y} 
                        r={hoverIndex === index ? 6 : 4} 
                        fill={hoverIndex === index ? "var(--primary-hover)" : "white"} 
                        stroke="var(--primary)" 
                        strokeWidth={3} 
                        style={{ transition: 'all var(--transition-fast)', cursor: 'pointer' }}
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(null)}
                      />
                      {hoverIndex === index && (
                        <g>
                          <rect 
                            x={point.x - 45} 
                            y={point.y - 42} 
                            width={90} 
                            height={30} 
                            rx={6} 
                            fill="var(--text-main)" 
                          />
                          <text 
                            x={point.x} 
                            y={point.y - 22} 
                            fill="white" 
                            fontSize="10" 
                            fontWeight="700" 
                            textAnchor="middle"
                          >
                            {formatINR(point.value)}
                          </text>
                        </g>
                      )}
                    </g>
                  ))}

                  {/* X Axis Labels */}
                  {chartData.map((point, index) => (
                    <text key={index} x={point.x} y="225" className="chart-axis-text" textAnchor="middle">
                      {point.month}
                    </text>
                  ))}
                </svg>
              )}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '0 8px' }}>
              <span>Regional Coverage: Tamil Nadu District</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--primary)', borderRadius: '50%' }}></div>
                <span style={{ fontWeight: '600' }}>Active Collection Revenue</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live System Log */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h2 className="card-title">
              <Database size={18} className="text-secondary" />
              Live System Log
            </h2>
          </div>
          
          <div className="activity-timeline" style={{ minHeight: '200px', display: 'flex', justifyContent: activities.length === 0 ? 'center' : 'flex-start' }}>
            {activities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifySelf: 'center', width: '100%' }}>
                <Database size={28} style={{ opacity: 0.3, marginBottom: '8px' }} />
                <span style={{ fontSize: '0.8rem' }}>No system logs generated yet.</span>
              </div>
            ) : (
              activities.slice(0, 5).map((act, index) => (
                <div className="activity-item" key={act.id}>
                  {index < Math.min(activities.length, 5) - 1 && (
                    <div style={{ 
                      position: 'absolute', 
                      left: '17px', 
                      top: '36px', 
                      bottom: '-20px', 
                      width: '2px', 
                      backgroundColor: 'var(--border-light)',
                      zIndex: 1
                    }}></div>
                  )}
                  <div className="activity-badge" style={{ backgroundColor: act.badgeBg || 'var(--primary-light)', color: act.badgeColor || 'var(--primary)' }}>
                    {act.icon}
                  </div>
                  <div className="activity-content">
                    <span className="activity-title">{act.title}</span>
                    <span className="activity-desc">{act.desc}</span>
                    <span className="activity-time">{act.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Payments Ledger Grid */}
      <div className="card" style={{ marginTop: '24px', marginBottom: 0 }}>
        <div className="card-header">
          <h2 className="card-title">
            <IndianRupee size={18} className="text-secondary" />
            Recent Billing Transactions Ledger
          </h2>
          <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('payments')}>
            <Plus size={14} /> Record Entry
          </button>
        </div>
        
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Receipt ID</th>
                <th>Operator Name</th>
                <th>Region Location</th>
                <th>Amount Paid</th>
                <th>Payment Mode</th>
                <th>Txn DateTime</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                    <AlertCircle size={24} style={{ margin: '0 auto 8px auto', display: 'block', opacity: 0.3 }} />
                    No payments transactions logged.
                  </td>
                </tr>
              ) : (
                transactions.slice(0, 5).map((txn) => (
                  <tr key={txn.id}>
                    <td style={{ fontWeight: '600' }}>{txn.receiptId}</td>
                    <td>{txn.operatorName}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} className="text-secondary" />
                        <span>{txn.region}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: '700' }}>{formatINR(txn.amount)}</td>
                    <td>
                      <span className="badge badge-info">{txn.mode}</span>
                    </td>
                    <td>{txn.dateTime}</td>
                    <td>
                      <span className="badge badge-success">{txn.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
