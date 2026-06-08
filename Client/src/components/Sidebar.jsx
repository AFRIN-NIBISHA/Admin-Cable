import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Tv, 
  CreditCard, 
  TrendingUp, 
  Bell, 
  LifeBuoy, 
  FileText, 
  Settings, 
  ShieldCheck,
  Tv2
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) {
  const menuGroups = [
    {
      title: "Core",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "analytics", label: "Customer Analytics", icon: TrendingUp }
      ]
    },
    {
      title: "Operations",
      items: [
        { id: "operators", label: "Operators Management", icon: Users },
        { id: "subscriptions", label: "Subscription Management", icon: Tv },
        { id: "payments", label: "Payment Management", icon: CreditCard }
      ]
    },
    {
      title: "Administration",
      items: [
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "tickets", label: "Support Tickets", icon: LifeBuoy },
        { id: "reports", label: "Reports", icon: FileText }
      ]
    },
    {
      title: "System",
      items: [
        { id: "settings", label: "System Settings", icon: Settings },
        { id: "backup", label: "Backup & Security", icon: ShieldCheck }
      ]
    }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <aside className={`sidebar-wrapper ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-logo-area">
        <div className="logo-icon">
          <Tv2 size={20} strokeWidth={2.5} />
        </div>
        <div className="logo-text-container">
          <div className="logo-text-wrapper">
            <span className="logo-brand-sky">Sky</span><span className="logo-brand-link">Link</span>
            <span className="logo-brand-cable">Cable</span>
          </div>
          <span className="logo-subtext">Admin Console</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx} style={{ marginBottom: '18px' }}>
            <div className="nav-section-title">{group.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="admin-avatar">
          A
        </div>
        <div className="admin-info">
          <span className="admin-name">Admin</span>
        </div>
      </div>
    </aside>
  );
}
