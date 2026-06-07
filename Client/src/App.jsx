import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import OperatorsManagement from './components/OperatorsManagement';
import SubscriptionManagement from './components/SubscriptionManagement';
import PaymentManagement from './components/PaymentManagement';
import CustomerAnalytics from './components/CustomerAnalytics';
import Notifications from './components/Notifications';
import SupportTickets from './components/SupportTickets';
import Reports from './components/Reports';
import SystemSettings from './components/SystemSettings';
import BackupSecurity from './components/BackupSecurity';

import { 
  Users, 
  CreditCard, 
  Tv, 
  LifeBuoy, 
  Database,
  BellRing
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast notifier helper
  const addToast = (title, message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts(prev => [...prev, { id, title, message, type }]);
    
    // Auto clear after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // --- Real-time Operation Databases (Initial Empty States) ---
  const [operators, setOperators] = useState([]);
  const [plans, setPlans] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activities, setActivities] = useState([]);
  
  // Real login history of current session
  const [loginHistory] = useState([
    { id: 1, time: "2026-06-07 18:33:04", user: "Arun Kumar (SuperAdmin)", ip: "192.168.1.42", browser: "Chrome / Windows 11" }
  ]);

  // --- Administrative State Modification Handlers ---

  const handleAddOperator = (newOp) => {
    const id = operators.length > 0 ? Math.max(...operators.map(o => o.id)) + 1 : 1;
    // Set default SaaS expiry date to 30 days from today
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    const expiryStr = expiry.toISOString().split('T')[0];

    const operator = { id, saasExpiry: expiryStr, ...newOp };
    setOperators(prev => [operator, ...prev]);
    
    const log = {
      id: Date.now(),
      title: "Operator Registered",
      desc: `Registered operator ${operator.name} in region ${operator.region}`,
      time: "Just now",
      icon: <Users size={16} />,
      badgeBg: "var(--primary-light)",
      badgeColor: "var(--primary)"
    };
    setActivities(prev => [log, ...prev]);
    addToast("Operator Registered", `New operator profile created for ${operator.name}.`);
  };

  const handleToggleOperatorStatus = (id) => {
    setOperators(prev => prev.map(op => {
      if (op.id === id) {
        const nextStatus = op.status === 'Active' ? 'Inactive' : 'Active';
        const log = {
          id: Date.now(),
          title: "Operator Status Toggle",
          desc: `Switched status of ${op.name} to ${nextStatus}`,
          time: "Just now",
          icon: <Users size={16} />,
          badgeBg: nextStatus === 'Active' ? "var(--success-light)" : "var(--danger-light)",
          badgeColor: nextStatus === 'Active' ? "var(--success)" : "var(--danger)"
        };
        setActivities(prev => [log, ...prev]);
        addToast("Operator Modified", `${op.name} profile is now ${nextStatus}.`, nextStatus === 'Active' ? 'success' : 'warning');
        return { ...op, status: nextStatus };
      }
      return op;
    }));
  };

  const handleSuspendOperator = (id) => {
    setOperators(prev => prev.map(op => {
      if (op.id === id) {
        const nextStatus = op.status === 'Suspended' ? 'Active' : 'Suspended';
        const log = {
          id: Date.now(),
          title: "Operator Suspended",
          desc: `Switched status of ${op.name} to ${nextStatus}`,
          time: "Just now",
          icon: <Users size={16} />,
          badgeBg: "var(--warning-light)",
          badgeColor: "var(--warning)"
        };
        setActivities(prev => [log, ...prev]);
        addToast("Operator Status Saved", `${op.name} has been ${nextStatus.toLowerCase()}.`, 'warning');
        return { ...op, status: nextStatus };
      }
      return op;
    }));
  };

  const handleDeleteOperator = (id) => {
    const op = operators.find(o => o.id === id);
    if (!op) return;
    setOperators(prev => prev.filter(o => o.id !== id));
    
    const log = {
      id: Date.now(),
      title: "Operator Deleted",
      desc: `Deleted operator profile ${op.name}`,
      time: "Just now",
      icon: <Users size={16} />,
      badgeBg: "var(--danger-light)",
      badgeColor: "var(--danger)"
    };
    setActivities(prev => [log, ...prev]);
    addToast("Operator Deleted", `Removed operator profile for ${op.name}.`, 'danger');
  };

  const handleEditOperator = (id, updatedFields) => {
    setOperators(prev => prev.map(op => {
      if (op.id === id) {
        addToast("Operator Saved", `Updated credentials for ${updatedFields.name}.`);
        return { ...op, ...updatedFields };
      }
      return op;
    }));
  };

  const handleAddPlan = (newPlan) => {
    const id = plans.length > 0 ? Math.max(...plans.map(p => p.id)) + 1 : 1;
    const plan = { id, ...newPlan };
    setPlans(prev => [...prev, plan]);

    const log = {
      id: Date.now(),
      title: "SaaS Plan Created",
      desc: `Created SaaS plan ${plan.name} at ₹${plan.price}`,
      time: "Just now",
      icon: <Tv size={16} />,
      badgeBg: "var(--primary-light)",
      badgeColor: "var(--primary)"
    };
    setActivities(prev => [log, ...prev]);
    addToast("SaaS Plan Created", `Successfully deployed ${plan.name} package.`);
  };

  const handleEditPlan = (id, updatedPlan) => {
    setPlans(prev => prev.map(p => {
      if (p.id === id) {
        addToast("SaaS Plan Saved", `Saved settings for ${updatedPlan.name}.`);
        return { ...p, ...updatedPlan };
      }
      return p;
    }));
  };

  const handleTogglePlanStatus = (id) => {
    setPlans(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'Active' ? 'Inactive' : 'Active';
        addToast("SaaS Plan Archived", `Subscription tier set to ${nextStatus === 'Active' ? 'Active' : 'Archived'}.`);
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  const handleUpgradeOperatorPlan = (opId, planId) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;
    setOperators(prev => prev.map(op => {
      if (op.id === opId) {
        const log = {
          id: Date.now(),
          title: "SaaS Plan Upgraded",
          desc: `Upgraded ${op.name} SaaS Plan to ${plan.name}`,
          time: "Just now",
          icon: <Tv size={16} />,
          badgeBg: "var(--primary-light)",
          badgeColor: "var(--primary)"
        };
        setActivities(prev => [log, ...prev]);
        addToast("SaaS Plan Upgraded", `${op.name} upgraded to ${plan.name}.`);
        return { ...op, saasPlanId: planId, saasPlanName: plan.name };
      }
      return op;
    }));
  };

  const handleRenewOperatorSubscription = (opId, months) => {
    setOperators(prev => prev.map(op => {
      if (op.id === opId) {
        const currentExpiry = op.saasExpiry ? new Date(op.saasExpiry) : new Date();
        currentExpiry.setMonth(currentExpiry.getMonth() + months);
        const newExpiryStr = currentExpiry.toISOString().split('T')[0];
        
        // Log transaction renewal payment
        const plan = plans.find(p => p.id === op.saasPlanId);
        const price = plan ? plan.price * months : 1500 * months;
        
        const receiptNum = "TXN-" + Math.floor(90000 + Math.random() * 10000);
        const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 16).split(' ')[0].split('-').reverse().join('-') + " " + new Date().toLocaleTimeString('en-US', {hour12: false}).substring(0, 5);
        
        const txn = {
          id: Date.now(),
          receiptId: receiptNum,
          operatorName: op.name,
          region: op.region,
          amount: price,
          mode: 'UPI',
          type: 'SaaS Subscription',
          dateTime: dateStr,
          status: 'Paid'
        };
        setTransactions(prevTxns => [txn, ...prevTxns]);

        const log = {
          id: Date.now(),
          title: "SaaS Plan Renewed",
          desc: `Renewed SaaS subscription for ${op.name} for ${months} months. Expiry: ${newExpiryStr}`,
          time: "Just now",
          icon: <Tv size={16} />,
          badgeBg: "var(--success-light)",
          badgeColor: "var(--success)"
        };
        setActivities(prev => [log, ...prev]);
        addToast("SaaS License Extended", `${op.name} extended to ${newExpiryStr}.`);
        
        return { ...op, saasExpiry: newExpiryStr, status: 'Active' };
      }
      return op;
    }));
  };

  const handleAddTransaction = (newTxn) => {
    const receiptNum = "TXN-" + Math.floor(90000 + Math.random() * 10000);
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 16).split(' ')[0].split('-').reverse().join('-') + " " + new Date().toLocaleTimeString('en-US', {hour12: false}).substring(0, 5);
    
    const txn = {
      id: Date.now(),
      receiptId: receiptNum,
      dateTime: dateStr,
      ...newTxn
    };

    setTransactions(prev => [txn, ...prev]);

    const log = {
      id: Date.now(),
      title: "Payment Recorded",
      desc: `Logged payment of ₹${txn.amount.toLocaleString()} via ${txn.mode} from ${txn.operatorName} (${txn.type})`,
      time: "Just now",
      icon: <CreditCard size={16} />,
      badgeBg: "var(--success-light)",
      badgeColor: "var(--success)"
    };
    setActivities(prev => [log, ...prev]);

    addToast("Collection Registered", `Transaction details saved under ID: ${txn.receiptId}`);
  };

  const handleAssignTicket = (ticketId, assignee) => {
    setTickets(prev => prev.map(tkt => {
      if (tkt.id === ticketId) {
        const log = {
          id: Date.now(),
          title: "Ticket Assigned",
          desc: `Assigned Support Ticket #${ticketId} to ${assignee}`,
          time: "Just now",
          icon: <LifeBuoy size={16} />,
          badgeBg: "var(--info-light)",
          badgeColor: "var(--info)"
        };
        setActivities(prev => [log, ...prev]);
        addToast("Ticket Assigned", `Assigned Ticket #${ticketId} to ${assignee}.`);
        return { ...tkt, assignedTo: assignee, status: 'Pending' };
      }
      return tkt;
    }));
  };

  const handleResolveTicket = (id) => {
    setTickets(prev => prev.map(tkt => {
      if (tkt.id === id) {
        const log = {
          id: Date.now(),
          title: "Ticket Resolved",
          desc: `Technical complaint Ticket #${id} marked as resolved.`,
          time: "Just now",
          icon: <LifeBuoy size={16} />,
          badgeBg: "var(--success-light)",
          badgeColor: "var(--success)"
        };
        setActivities(prev => [log, ...prev]);
        addToast("Ticket Resolved", `Marked Ticket #${id} status as resolved.`);
        return { ...tkt, status: 'Closed' };
      }
      return tkt;
    }));
  };

  const handleReplyTicket = (id, replyMsg) => {
    setTickets(prev => prev.map(tkt => {
      if (tkt.id === id) {
        const history = [...tkt.history, replyMsg];
        addToast("Reply Sent", `Dispatched response ticket to Operator ${tkt.operator}.`);
        return { ...tkt, history, status: 'Pending' };
      }
      return tkt;
    }));
  };

  const handleSendBroadcast = (broadcast) => {
    const id = broadcasts.length + 1;
    const item = { id, ...broadcast };
    setBroadcasts(prev => [item, ...prev]);

    // Instantly append alert banner dropdown state
    const alertId = Date.now();
    const newAlert = {
      id: alertId,
      title: `Broadcast: ${item.title}`,
      message: item.message,
      time: "Just now"
    };
    setNotifications(prev => [newAlert, ...prev]);

    const log = {
      id: Date.now(),
      title: "Broadcast Dispatched",
      desc: `Announcement broadcast pushed to ${item.target} via ${item.gateway}`,
      time: "Just now",
      icon: <BellRing size={16} />,
      badgeBg: "var(--primary-light)",
      badgeColor: "var(--primary)"
    };
    setActivities(prev => [log, ...prev]);

    addToast("Broadcast Sent", `Message successfully routed over ${item.gateway}.`);
  };

  const handleSaveSettings = (successMessage) => {
    addToast("Settings Updated", successMessage);
    const log = {
      id: Date.now(),
      title: "Config Saved",
      desc: "Administration portal settings configurations saved.",
      time: "Just now",
      icon: <Database size={16} />,
      badgeBg: "var(--info-light)",
      badgeColor: "var(--info)"
    };
    setActivities(prev => [log, ...prev]);
  };

  const handleClearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    addToast("Alerts Cleared", "Emptied unread alerts dropdown logs.", "info");
  };

  // --- Dynamic Switch View Switcher ---
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            setActiveTab={setActiveTab} 
            operators={operators} 
            transactions={transactions} 
            tickets={tickets}
            activities={activities}
          />
        );
      case 'operators':
        return (
          <OperatorsManagement 
            operators={operators} 
            plans={plans}
            transactions={transactions}
            onAddOperator={handleAddOperator}
            onToggleStatus={handleToggleOperatorStatus}
            onSuspendOperator={handleSuspendOperator}
            onDeleteOperator={handleDeleteOperator}
            onEditOperator={handleEditOperator}
          />
        );
      case 'subscriptions':
        return (
          <SubscriptionManagement 
            plans={plans} 
            operators={operators}
            onAddPlan={handleAddPlan}
            onEditPlan={handleEditPlan}
            onTogglePlanStatus={handleTogglePlanStatus}
            onUpgradePlan={handleUpgradeOperatorPlan}
            onRenewPlan={handleRenewOperatorSubscription}
          />
        );
      case 'payments':
        return (
          <PaymentManagement 
            transactions={transactions} 
            operators={operators}
            plans={plans}
            onAddTransaction={handleAddTransaction}
          />
        );
      case 'analytics':
        return <CustomerAnalytics operators={operators} transactions={transactions} />;
      case 'notifications':
        return (
          <Notifications 
            broadcasts={broadcasts} 
            onSendBroadcast={handleSendBroadcast} 
          />
        );
      case 'tickets':
        return (
          <SupportTickets 
            tickets={tickets} 
            onResolveTicket={handleResolveTicket}
            onAssignTicket={handleAssignTicket}
            onReplyTicket={handleReplyTicket}
          />
        );
      case 'reports':
        return (
          <Reports 
            transactions={transactions} 
            operators={operators} 
          />
        );
      case 'settings':
        return <SystemSettings onSaveSettings={handleSaveSettings} />;
      case 'backup':
        return (
          <BackupSecurity 
            loginHistory={loginHistory}
            activities={activities}
            onTriggerToast={addToast}
          />
        );
      default:
        return (
          <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-secondary)' }}>
            Selected console view currently under construction.
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        notifications={notifications}
        onClearNotification={handleClearNotification}
        onClearAllNotifications={handleClearAllNotifications}
      />

      <main className="main-wrapper">
        {renderActiveView()}
      </main>

      {/* Dynamic Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <div className="toast-content">
              <div className="toast-title">{toast.title}</div>
              <div className="toast-message">{toast.message}</div>
            </div>
            <button 
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} 
              style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
