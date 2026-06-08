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
                <span className="logo-brand-sky">Sky</span><span className="logo-brand-link">Link</span>
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
                <div 
                  style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }}
                  onClick={() => setDropdownOpen(false)}
                ></div>
                <div className="notif-dropdown">
                  <div className="notif-dropdown-header">
                    <span className="notif-dropdown-title">System Alerts</span>
                    {notifications.length > 0 && (
                      <button 
                        className="notif-clear-btn"
                        onClick={() => { onClearAllNotifications(); setDropdownOpen(false); }}
                      >
                        <Trash2 size={12} /> Clear all
                      </button>
                    )}
                  </div>
                  <div className="notif-dropdown-body">
                    {notifications.length === 0 ? (
                      <div className="notif-empty">
                        <MailOpen size={32} style={{ margin: '0 auto 10px auto', display: 'block', opacity: 0.25 }} />
                        No unread alerts
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className="notif-item">
                          <div>
                            <div className="notif-item-title">{notif.title}</div>
                            <div className="notif-item-msg">{notif.message}</div>
                            <div className="notif-item-time">{notif.time}</div>
                          </div>
                          <button 
                            className="notif-dismiss"
                            onClick={() => onClearNotification(notif.id)}
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
