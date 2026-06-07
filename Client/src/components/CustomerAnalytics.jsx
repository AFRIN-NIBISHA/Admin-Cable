import React, { useState } from 'react';
import { TrendingUp, BarChart2, PieChart, Users, DollarSign, RefreshCw, Activity, AlertCircle } from 'lucide-react';

export default function CustomerAnalytics({ operators, transactions }) {
  // 1. Total Customers (Subscribers count)
  const totalSubscribers = operators.reduce((acc, curr) => acc + (curr.subscribers || 0), 0);
  const averageSubscribers = operators.length > 0 ? Math.round(totalSubscribers / operators.length) : 0;

  // 2. State-wise Customers (derived dynamically from operators list)
  const getStateShares = () => {
    const stateMap = {};
    operators.forEach(op => {
      const state = op.state || 'Tamil Nadu';
      if (!stateMap[state]) {
        stateMap[state] = 0;
      }
      stateMap[state] += op.subscribers || 0;
    });

    const colors = ["var(--primary)", "var(--success)", "var(--warning)", "var(--info)", "var(--danger)"];
    let accumulatedPct = 0;

    return Object.keys(stateMap).map((state, idx) => {
      const count = stateMap[state];
      const pct = totalSubscribers > 0 ? Math.round((count / totalSubscribers) * 100) : 0;
      const share = {
        state,
        count,
        pct,
        strokeColor: colors[idx % colors.length],
        offset: accumulatedPct
      };
      accumulatedPct += pct;
      return share;
    });
  };

  const stateShares = getStateShares();

  // 3. Operator-wise Customers (derived dynamically from operators list)
  const getOperatorShares = () => {
    const list = operators.map(op => ({
      name: op.name,
      value: op.subscribers || 0
    })).sort((a, b) => b.value - a.value);

    const maxSubscribers = list.length > 0 ? Math.max(...list.map(l => l.value)) : 0;
    const colors = ["var(--primary)", "var(--success)", "var(--info)", "var(--warning)", "var(--danger)"];

    return list.map((op, idx) => ({
      name: op.name,
      value: op.value,
      width: maxSubscribers > 0 ? Math.round((op.value / maxSubscribers) * 100) : 0,
      color: colors[idx % colors.length]
    }));
  };

  const operatorShares = getOperatorShares();

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Derive ARPU (Average Revenue Per User)
  const getARPU = () => {
    if (totalSubscribers === 0) return 0;
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    return Math.round(totalRevenue / totalSubscribers);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      
      {/* Metric Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Customers</span>
            <div className="stat-card-icon primary">
              <Users size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-card-value">{totalSubscribers.toLocaleString()}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Across all operator lines</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Average Revenue per User (ARPU)</span>
            <div className="stat-card-icon primary">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-card-value">{formatINR(getARPU())}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Based on actual billing logs</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Avg Sub / Operator</span>
            <div className="stat-card-icon warning">
              <Users size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-card-value">{averageSubscribers} lines</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Uniform regional coverage</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Active Database States</span>
            <div className="stat-card-icon info">
              <Activity size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-card-value">{stateShares.length} States</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Licensing active</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts split */}
      <div className="content-layout">
        
        {/* Left: Operator-wise Customers (Custom SVG bars) */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h2 className="card-title">
              <BarChart2 size={18} className="text-secondary" />
              Operator-wise Customers Distribution
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0', minHeight: '260px', justifyContent: operatorShares.length === 0 ? 'center' : 'flex-start' }}>
            {operatorShares.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
                <AlertCircle size={32} style={{ margin: '0 auto 8px auto', display: 'block', opacity: 0.3 }} />
                No operators registered to display customer distribution.
              </div>
            ) : (
              operatorShares.map((op, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: '600' }}>{op.name}</span>
                    <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{op.value.toLocaleString()} Customers</span>
                  </div>
                  
                  {/* Horizontal bar visualization */}
                  <div 
                    style={{ 
                      height: '24px', 
                      width: '100%', 
                      backgroundColor: 'var(--border-light)', 
                      borderRadius: '6px', 
                      overflow: 'hidden',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${Math.max(op.width, 5)}%`, 
                        backgroundColor: op.color, 
                        borderRadius: '4px',
                        transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '12px',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: '700'
                      }}
                    >
                      {op.value.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: State-wise Customers Share (Custom SVG donut) */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h2 className="card-title">
              <PieChart size={18} className="text-secondary" />
              State-wise Customers Share (%)
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '260px', justifyContent: 'center' }}>
            {totalSubscribers === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
                <AlertCircle size={32} style={{ margin: '0 auto 8px auto', display: 'block', opacity: 0.3 }} />
                No customer states mapped.
              </div>
            ) : (
              <>
                <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                  <svg width="100%" height="100%" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)' }}>
                    {stateShares.map((share, idx) => {
                      const dashArray = `${share.pct} ${100 - share.pct}`;
                      const dashOffset = 100 - share.offset;
                      return (
                        <circle
                          key={idx}
                          cx="21"
                          cy="21"
                          r="15.91549430918954"
                          className="chart-donut-segment"
                          stroke={share.strokeColor}
                          strokeDasharray={dashArray}
                          strokeDashoffset={dashOffset}
                        />
                      );
                    })}
                  </svg>
                  {/* Central text displaying total */}
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%)', 
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1 }}>
                      {totalSubscribers}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', marginTop: '4px' }}>
                      Customers
                    </div>
                  </div>
                </div>

                {/* Custom Legend */}
                <div style={{ marginTop: '24px', width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {stateShares.map((share, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '10px', height: '10px', backgroundColor: share.strokeColor, borderRadius: '50%' }}></div>
                        <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>{share.state}</span>
                      </div>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                        {share.count.toLocaleString()} ({share.pct}%)
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
