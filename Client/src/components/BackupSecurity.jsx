import React, { useState } from 'react';
import { Shield, Database, Play, CheckCircle2, Clock, Terminal, Calendar, AlertCircle, Key, ShieldCheck, UserCheck } from 'lucide-react';
import CustomSelect from './CustomSelect';

export default function BackupSecurity({ loginHistory, activities, onTriggerToast }) {
  const [activeTab, setActiveTab] = useState('snapshots');
  const [backupProgress, setBackupProgress] = useState(-1);
  const [frequency, setFrequency] = useState('Daily');

  const [backupLogs, setBackupLogs] = useState([
    { file: "skylink_prod_db_2026-06-06.sql", size: "18.4 MB", timestamp: "Yesterday, 04:30 AM", status: "Stored Cloud S3" },
    { file: "skylink_prod_db_2026-06-05.sql", size: "18.3 MB", timestamp: "05-06-2026, 04:30 AM", status: "Stored Cloud S3" }
  ]);

  // Role Permissions state (dynamic checkboxes)
  const [rolePermissions, setRolePermissions] = useState({
    SuperAdmin: { operators: true, subscriptions: true, payments: true, reports: true, settings: true },
    Support: { operators: true, subscriptions: false, payments: false, reports: true, settings: false },
    Operator: { operators: false, subscriptions: false, payments: true, reports: false, settings: false }
  });

  const handlePermissionToggle = (role, scope) => {
    setRolePermissions(prev => {
      const updated = {
        ...prev,
        [role]: {
          ...prev[role],
          [scope]: !prev[role][scope]
        }
      };
      onTriggerToast("Permissions Updated", `Modified ${scope} access scope for ${role} role.`);
      return updated;
    });
  };

  const runManualBackup = () => {
    if (backupProgress >= 0) return;
    setBackupProgress(0);
    
    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const todayDate = new Date().toISOString().split('T')[0];
          const newLog = {
            file: `skylink_prod_db_manual_${todayDate}.sql`,
            size: "18.6 MB",
            timestamp: "Just now",
            status: "Stored Cloud S3"
          };
          setBackupLogs(prevLogs => [newLog, ...prevLogs]);
          onTriggerToast("Backup completed successfully.", `Created database SQL backup: ${newLog.file}`);
          setTimeout(() => setBackupProgress(-1), 1500);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  return (
    <div>
      
      {/* Overview stats cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Database Storage Status</span>
            <div className="stat-card-icon success">
              <Database size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-card-value">Healthy (100%)</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Size on disk: 1.42 GB</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Portal Firewalls</span>
            <div className="stat-card-icon primary">
              <Shield size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-card-value">Active</span>
            <span className="badge badge-success" style={{ width: 'fit-content', fontSize: '0.7rem' }}>SSL Encrypted</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Active Security Audits</span>
            <div className="stat-card-icon info">
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-card-value">0 Threat Warnings</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>All logins matching white-lists</span>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--border-light)', flexWrap: 'wrap' }}>
          <button 
            type="button" className="btn" onClick={() => setActiveTab('snapshots')}
            style={{ 
              borderRadius: 0, padding: '16px 24px', 
              borderBottom: activeTab === 'snapshots' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'snapshots' ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: activeTab === 'snapshots' ? 'white' : 'transparent',
              fontWeight: activeTab === 'snapshots' ? '700' : '500'
            }}
          >
            <Database size={16} /> Database Backup
          </button>
          
          <button 
            type="button" className="btn" onClick={() => setActiveTab('activities')}
            style={{ 
              borderRadius: 0, padding: '16px 24px', 
              borderBottom: activeTab === 'activities' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'activities' ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: activeTab === 'activities' ? 'white' : 'transparent',
              fontWeight: activeTab === 'activities' ? '700' : '500'
            }}
          >
            <Terminal size={16} /> Activity Logs
          </button>

          <button 
            type="button" className="btn" onClick={() => setActiveTab('history')}
            style={{ 
              borderRadius: 0, padding: '16px 24px', 
              borderBottom: activeTab === 'history' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'history' ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: activeTab === 'history' ? 'white' : 'transparent',
              fontWeight: activeTab === 'history' ? '700' : '500'
            }}
          >
            <Clock size={16} /> Login History
          </button>

          <button 
            type="button" className="btn" onClick={() => setActiveTab('permissions')}
            style={{ 
              borderRadius: 0, padding: '16px 24px', 
              borderBottom: activeTab === 'permissions' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'permissions' ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: activeTab === 'permissions' ? 'white' : 'transparent',
              fontWeight: activeTab === 'permissions' ? '700' : '500'
            }}
          >
            <UserCheck size={16} /> User Permissions
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          
          {/* 1. Database Backup Tab */}
          {activeTab === 'snapshots' && (
            <div className="tab-panel-enter">
              <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '24px' }}>
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
                    Trigger Manual Database Snapshot
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Compresses operational and configurations database schemas into AWS S3 cold backup repositories.
                  </p>

                  {backupProgress < 0 ? (
                    <button className="btn btn-primary btn-sm" onClick={runManualBackup} style={{ display: 'inline-flex', gap: '6px' }}>
                      <Play size={14} /> Start Backup Snapshot
                    </button>
                  ) : (
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px' }}>
                        <span>Writing schemas...</span>
                        <span>{backupProgress}%</span>
                      </div>
                      <div className="progress-bar-container">
                        <div 
                          className={`progress-bar-fill ${backupProgress === 100 ? 'success' : ''}`} 
                          style={{ width: `${backupProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ width: '200px' }}>
                  <label className="form-label" style={{ fontWeight: '700', marginBottom: '6px' }}>Auto-Backup Frequency</label>
                  <CustomSelect 
                    value={frequency}
                    onChange={(e) => { setFrequency(e.target.value); onTriggerToast("Backup scheduler frequency modified.", `Frequency set to: ${e.target.value}`); }}
                    options={[
                      { value: "Hourly", label: "Hourly Incremental" },
                      { value: "Daily", label: "Daily Full Snapshots" },
                      { value: "Weekly", label: "Weekly Complete" },
                      { value: "Disabled", label: "Disabled" }
                    ]}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <span style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '12px' }}>
                Historical Snapshots Log
              </span>
              <div className="table-wrapper" style={{ margin: 0 }}>
                <table className="custom-table" style={{ fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      <th>Filename</th>
                      <th>File Size</th>
                      <th>Timestamp</th>
                      <th>Storage Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backupLogs.map((log, index) => (
                      <tr key={index}>
                        <td style={{ fontFamily: 'monospace', fontWeight: '600' }}>{log.file}</td>
                        <td>{log.size}</td>
                        <td>{log.timestamp}</td>
                        <td>
                          <span className="badge badge-success">{log.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. Activity Logs Tab */}
          {activeTab === 'activities' && (
            <div className="tab-panel-enter">
              <span style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '12px' }}>System Operations Logs</span>
              <div className="table-wrapper" style={{ margin: 0 }}>
                <table className="custom-table" style={{ fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      <th>DateTime</th>
                      <th>Operation Category</th>
                      <th>Action Details</th>
                      <th>Operator</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '16px', color: 'var(--text-secondary)' }}>No actions logged yet.</td>
                      </tr>
                    ) : (
                      activities.map((act) => (
                        <tr key={act.id}>
                          <td>{act.time}</td>
                          <td style={{ fontWeight: '600' }}>{act.title}</td>
                          <td>{act.desc}</td>
                          <td>System Admin</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. Login History Tab */}
          {activeTab === 'history' && (
            <div className="tab-panel-enter">
              <span style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '12px' }}>Access Authentication History</span>
              <div className="table-wrapper" style={{ margin: 0 }}>
                <table className="custom-table" style={{ fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Access Identity</th>
                      <th>Network Address IP</th>
                      <th>Browser / OS</th>
                      <th>Auth Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginHistory.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '16px', color: 'var(--text-secondary)' }}>No access trials recorded.</td>
                      </tr>
                    ) : (
                      loginHistory.map((log) => (
                        <tr key={log.id}>
                          <td>{log.time}</td>
                          <td style={{ fontWeight: '600' }}>{log.user}</td>
                          <td>{log.ip}</td>
                          <td>{log.browser}</td>
                          <td>
                            <span className="badge badge-success">Success</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. Role Permissions Grid Tab */}
          {activeTab === 'permissions' && (
            <div className="tab-panel-enter">
              <span style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '8px' }}>Assign Access Privileges Matrix</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Toggle functional authorizations assigned to organizational profiles.
              </p>

              <div className="table-wrapper" style={{ margin: 0 }}>
                <table className="custom-table" style={{ textAlign: 'center' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>System Role Group</th>
                      <th>Operators CRUD</th>
                      <th>Subscriptions SaaS</th>
                      <th>Payments Billing</th>
                      <th>Reports Audit</th>
                      <th>System Settings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(rolePermissions).map(role => (
                      <tr key={role}>
                        <td style={{ textAlign: 'left', fontWeight: '700' }}>{role}</td>
                        <td>
                          <input 
                            type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                            checked={rolePermissions[role].operators}
                            onChange={() => handlePermissionToggle(role, 'operators')}
                          />
                        </td>
                        <td>
                          <input 
                            type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                            checked={rolePermissions[role].subscriptions}
                            onChange={() => handlePermissionToggle(role, 'subscriptions')}
                          />
                        </td>
                        <td>
                          <input 
                            type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                            checked={rolePermissions[role].payments}
                            onChange={() => handlePermissionToggle(role, 'payments')}
                          />
                        </td>
                        <td>
                          <input 
                            type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                            checked={rolePermissions[role].reports}
                            onChange={() => handlePermissionToggle(role, 'reports')}
                          />
                        </td>
                        <td>
                          <input 
                            type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                            checked={rolePermissions[role].settings}
                            onChange={() => handlePermissionToggle(role, 'settings')}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
      
    </div>
  );
}
