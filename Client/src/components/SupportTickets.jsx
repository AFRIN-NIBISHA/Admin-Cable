import React, { useState } from 'react';
import { LifeBuoy, Search, AlertCircle, Clock, CheckCircle2, MessageSquare, Send, User, ChevronRight, UserCheck } from 'lucide-react';

export default function SupportTickets({ 
  tickets, 
  onResolveTicket, 
  onAssignTicket,
  onReplyTicket 
}) {
  const [selectedTicketId, setSelectedTicketId] = useState(tickets[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [replyText, setReplyText] = useState('');
  
  // Assignee states
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const supportTeam = ["Tech Ramesh", "Tech Priya", "Admin Arun", "Support Staff Balaji", "Technician Vignesh"];

  const selectedTicket = tickets.find(tkt => tkt.id === selectedTicketId);

  // Filters
  const filteredTickets = tickets.filter(tkt => {
    const matchesSearch = tkt.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tkt.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tkt.id.toString().includes(searchTerm);
    const matchesPriority = priorityFilter === 'All' || tkt.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicketId) return;

    onReplyTicket(selectedTicketId, replyText);
    setReplyText('');
  };

  const handleAssignAction = (e) => {
    e.preventDefault();
    if (!selectedAssignee || !selectedTicketId) {
      alert("Please select a team member.");
      return;
    }
    onAssignTicket(selectedTicketId, selectedAssignee);
    setSelectedAssignee('');
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      
      <div className="content-layout">
        
        {/* Left Side: Tickets Queue */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card" style={{ marginBottom: 0 }}>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div className="search-bar" style={{ display: 'flex', flex: 1, minWidth: '180px' }}>
                <Search size={16} className="text-secondary" />
                <input 
                  type="text" 
                  placeholder="Search Ticket ID, Operator..." 
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select 
                className="form-select"
                style={{ width: '130px', padding: '6px 12px' }}
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="All">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '480px', overflowY: 'auto' }}>
              {filteredTickets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
                  No support tickets found matching criteria.
                </div>
              ) : (
                filteredTickets.map((tkt) => {
                  const isSelected = tkt.id === selectedTicketId;
                  return (
                    <div 
                      key={tkt.id}
                      onClick={() => setSelectedTicketId(tkt.id)}
                      style={{ 
                        border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                        backgroundColor: isSelected ? 'var(--primary-light)' : 'white',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '90%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-main)' }}>#{tkt.id}</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-secondary)' }}>{tkt.operator}</span>
                        </div>
                        <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {tkt.issue}
                        </span>
                        
                        {tkt.assignedTo && (
                          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <UserCheck size={12} /> Assigned: {tkt.assignedTo}
                          </span>
                        )}

                        <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                          <span className={`badge ${tkt.priority === 'High' ? 'badge-danger' : tkt.priority === 'Medium' ? 'badge-warning' : 'badge-info'}`} style={{ fontSize: '0.65rem' }}>
                            {tkt.priority}
                          </span>
                          <span className={`badge ${tkt.status === 'Open' ? 'badge-warning' : tkt.status === 'Pending' ? 'badge-info' : 'badge-success'}`} style={{ fontSize: '0.65rem' }}>
                            {tkt.status}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-secondary" />
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>

        {/* Right Side: Details & Chat Thread */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {selectedTicket ? (
            <div className="card" style={{ marginBottom: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div 
                  style={{ 
                    borderBottom: '1px solid var(--border-color)', 
                    paddingBottom: '16px', 
                    marginBottom: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Ticket Details #{selectedTicket.id}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Registered by {selectedTicket.operator} ({selectedTicket.region})</span>
                  </div>
                  
                  {selectedTicket.status !== 'Closed' ? (
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => onResolveTicket(selectedTicket.id)}
                    >
                      <CheckCircle2 size={14} /> Resolve & Close
                    </button>
                  ) : (
                    <span className="badge badge-success" style={{ gap: '4px' }}>
                      <CheckCircle2 size={14} /> Resolved & Closed
                    </span>
                  )}
                </div>

                {/* Ticket Assignment form panel */}
                {selectedTicket.status !== 'Closed' && (
                  <div style={{ backgroundColor: 'var(--border-light)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
                    <form onSubmit={handleAssignAction} style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                      <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                        <label className="form-label">Assign Technician / Support Agent</label>
                        <select className="form-select" style={{ padding: '6px 12px' }} value={selectedAssignee} onChange={(e) => setSelectedAssignee(e.target.value)} required>
                          <option value="">-- Select Personnel --</option>
                          {supportTeam.map(name => (
                            <option key={name} value={name}>{name}</option>
                          ))}
                        </select>
                      </div>
                      <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 12px' }}>
                        Assign Staff
                      </button>
                    </form>
                  </div>
                )}

                {/* Problem Description */}
                <div 
                  style={{ 
                    backgroundColor: 'var(--border-light)', 
                    borderRadius: 'var(--radius-md)', 
                    padding: '16px', 
                    border: '1px solid var(--border-color)',
                    marginBottom: '20px'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Issue Reported:
                  </span>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: '500' }}>
                    {selectedTicket.issue}
                  </p>
                  {selectedTicket.assignedTo && (
                    <div style={{ marginTop: '10px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)' }}>
                      Assigned Tech: {selectedTicket.assignedTo}
                    </div>
                  )}
                </div>

                {/* Ticket Message Thread */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', maxHeight: '200px', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{ padding: '6px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                      <User size={14} />
                    </div>
                    <div style={{ backgroundColor: 'var(--border-light)', padding: '10px 14px', borderRadius: '0px 12px 12px 12px', maxWidth: '85%' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '2px' }}>
                        {selectedTicket.operator}
                      </span>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Requesting support on client feed syncing parameters. Box reports E-16 signal check failure.
                      </p>
                    </div>
                  </div>

                  {selectedTicket.history && selectedTicket.history.map((msg, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                      <div style={{ backgroundColor: 'var(--primary-light)', padding: '10px 14px', borderRadius: '12px 0px 12px 12px', maxWidth: '85%', border: '1px solid var(--primary-light)' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', display: 'block', marginBottom: '2px', textAlign: 'right' }}>
                          Administrator
                        </span>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {msg}
                        </p>
                      </div>
                      <div style={{ padding: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white' }}>
                        <User size={14} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply field */}
              {selectedTicket.status !== 'Closed' && (
                <form onSubmit={handleSendReply} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <textarea 
                      className="form-textarea" 
                      placeholder="Type response log or action comment..." 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      required
                      style={{ minHeight: '60px' }}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm" style={{ float: 'right', display: 'flex', gap: '4px' }}>
                    <Send size={12} /> Send Response
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
              Select a ticket to review communications and staff assignments.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
