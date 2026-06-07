import React, { useState } from 'react';
import { Bell, Search, Menu, Tv2, Trash2, MailOpen } from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab,
  mobileOpen, 
  setMobileOpen, 
  notifications, 
  onClearNotification, 
  onClearAllNotifications 
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "analytics", label: "Analytics" },
    { id: "operators", label: "Operators" },
    { id: "subscriptions", label: "Subscriptions" },
    { id: "payments", label: "Payments" },
    { id: "notifications", label: "Notifications" },
    { id: "tickets", label: "Tickets" },
    { id: "reports", label: "Reports" },
    { id: "settings", label: "Settings" },
    { id: "backup", label: "Security" }
  ];

  return (
    <header className="header-wrapper">
      {/* Row 1: Brand Logo & Actions */}
      <div className="header-top-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            className="icon-btn mobile-menu-btn" 
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Menu size={20} />
          </button>
          
          <div className="header-logo-area">
            <div className="logo-icon">
              <Tv2 size={18} strokeWidth={2.5} />
            </div>
            <div className="logo-text-container">
              <div className="logo-text-wrapper">
                <span className="logo-brand-sky">Sky</span>
                <span className="logo-brand-link">Link</span>
                <span className="logo-brand-cable">Cable</span>
              </div>
              <span className="logo-subtext">Admin Console</span>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <div className="search-bar">
            <Search size={16} className="text-secondary" />
            <input 
              type="text" 
              placeholder="Search transactions, customers..." 
              className="search-input" 
            />
          </div>

          {/* Database Sync Status */}
          <div className="db-status-badge">
            <div className="db-status-dot"></div>
            <span>Cloud DB Connected</span>
          </div>

          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              className="icon-btn" 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              title="System alerts"
            >
              <Bell size={18} />
              {notifications.length > 0 && (
                <span className="btn-badge">{notifications.length}</span>
              )}
            </button>

            {dropdownOpen && (
              <>
                {/* Backing backdrop for close clicks */}
                <div 
                  style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }}
                  onClick={() => setDropdownOpen(false)}
                ></div>
                <div 
                  style={{ 
                    position: 'absolute', 
                    top: '50px', 
                    right: '0', 
                    backgroundColor: 'white', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: 'var(--radius-lg)', 
                    width: '320px', 
                    boxShadow: 'var(--shadow-xl)', 
                    zIndex: 100, 
                    overflow: 'hidden',
                    animation: 'slideUp 0.2s ease'
                  }}
                >
                  <div 
                    style={{ 
                      padding: '16px', 
                      borderBottom: '1px solid var(--border-color)', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      backgroundColor: 'var(--border-light)'
                    }}
                  >
                    <span style={{ fontWeight: '700', fontSize: '0.875rem' }}>System Alerts</span>
                    {notifications.length > 0 && (
                      <button 
                        onClick={() => { onClearAllNotifications(); setDropdownOpen(false); }}
                        style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Trash2 size={12} /> Clear all
                      </button>
                    )}
                  </div>
                  <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        <MailOpen size={32} style={{ margin: '0 auto 8px auto', display: 'block', opacity: 0.3 }} />
                        No unread alerts
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          style={{ 
                            padding: '12px 16px', 
                            borderBottom: '1px solid var(--border-light)', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'flex-start',
                            gap: '12px'
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-main)' }}>{notif.title}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{notif.message}</span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{notif.time}</span>
                          </div>
                          <button 
                            onClick={() => onClearNotification(notif.id)}
                            style={{ color: 'var(--text-secondary)', padding: '2px' }}
                            title="Dismiss"
                          >
                            &times;
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Admin Avatar */}
          <div className="header-admin-info">
            <div className="admin-avatar-sm">
              A
            </div>
            <div className="admin-text-sm">
              <span className="admin-name-sm">Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Horizontal Menu Navigation */}
      <nav className="header-nav-row">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-link-item ${activeTab === item.id ? 'active' : ''}`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
