'use client'

import { useMemo, useState } from 'react'
import './home.css'

type ApplicationStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected'
type Application = { id: number; company: string; role: string; status: ApplicationStatus; location: string; employment: string; date: string; updated: string; initials: string; color: string }
type Range = 'Today' | 'This Week' | 'This Month'

const initialApplications: Application[] = [
  { id: 1, company: 'Notion', role: 'Product Designer', status: 'Interview', location: 'Remote', employment: 'Full-time', date: 'Mar 18, 2024', updated: '2 days ago', initials: 'N', color: 'lavender' },
  { id: 2, company: 'Linear', role: 'Senior Product Designer', status: 'Applied', location: 'San Francisco, CA', employment: 'Full-time', date: 'Mar 15, 2024', updated: '5 days ago', initials: 'L', color: 'blue' },
  { id: 3, company: 'Vercel', role: 'Product Designer', status: 'Offer', location: 'Remote', employment: 'Full-time', date: 'Mar 12, 2024', updated: '1 week ago', initials: 'V', color: 'black' },
  { id: 4, company: 'Figma', role: 'Design Engineer', status: 'Rejected', location: 'New York, NY', employment: 'Full-time', date: 'Mar 08, 2024', updated: '1 week ago', initials: 'F', color: 'purple' },
  { id: 5, company: 'Ramp', role: 'Product Designer', status: 'Applied', location: 'New York, NY', employment: 'Full-time', date: 'Mar 05, 2024', updated: '2 weeks ago', initials: 'R', color: 'green' },
  { id: 6, company: 'Arc', role: 'Product Designer', status: 'Applied', location: 'Remote', employment: 'Contract', date: 'Mar 02, 2024', updated: '2 weeks ago', initials: 'A', color: 'orange' },
]
export default function HomePage() {
  const [applications, setApplications] = useState(initialApplications)
  const [activeView, setActiveView] = useState<'dashboard' | 'applications'>('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [range, setRange] = useState<Range>('This Week')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'All statuses' | ApplicationStatus>('All statuses')
  const [showDialog, setShowDialog] = useState(false)
  const [newCompany, setNewCompany] = useState('')
  const [newRole, setNewRole] = useState('')
  const filteredApplications = useMemo(() => applications.filter((item) => `${item.company} ${item.role} ${item.location}`.toLowerCase().includes(query.toLowerCase()) && (filter === 'All statuses' || item.status === filter)), [applications, query, filter])
  const counts = { total: applications.length, applied: applications.filter((item) => item.status === 'Applied').length, interviews: applications.filter((item) => item.status === 'Interview').length, offers: applications.filter((item) => item.status === 'Offer').length }
  const comparison = range === 'Today' ? 'vs yesterday' : range === 'This Month' ? 'vs last month' : 'vs last week'
  const updateStatus = (id: number, status: ApplicationStatus) => setApplications((items) => items.map((item) => item.id === id ? { ...item, status, updated: 'Just now' } : item))
  const addApplication = () => { if (!newCompany.trim() || !newRole.trim()) return; setApplications((items) => [{ id: Date.now(), company: newCompany.trim(), role: newRole.trim(), status: 'Applied', location: 'Not specified', employment: 'Full-time', date: 'Today', updated: 'Just now', initials: newCompany.trim()[0].toUpperCase(), color: 'blue' }, ...items]); setNewCompany(''); setNewRole(''); setShowDialog(false) }

  return <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
    <aside className="app-sidebar">
      <div className="sidebar-top"><a className="brand" href="#top" aria-label="ApplyFlow home"><span className="brand-mark">A</span><span className="brand-name">ApplyFlow</span></a><button className="collapse-button" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}><md-icon>{collapsed ? 'right_panel_open' : 'left_panel_close'}</md-icon></button></div>
      <nav className="sidebar-nav" aria-label="Main navigation"><button title="Dashboard" className={`side-nav-link ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveView('dashboard')}><md-icon>grid_view</md-icon><span>Dashboard</span></button><button title="Applications" className={`side-nav-link ${activeView === 'applications' ? 'active' : ''}`} onClick={() => setActiveView('applications')}><md-icon>work_outline</md-icon><span>Applications</span></button><button title="Settings" className="side-nav-link"><md-icon>settings</md-icon><span>Settings</span></button></nav>
      <div className="sidebar-footer"><div className="profile-avatar">JD</div><div className="profile-copy"><strong>Jamie Davis</strong><span>Personal workspace</span></div></div>
    </aside>
    <main id="top" className="main-content">
      <header className="top-header"><h1>{activeView === 'dashboard' ? 'Dashboard' : 'Applications'}</h1><div className="header-meta"><span>Monday, March 25, 2024</span><button className="icon-button" aria-label="Notifications"><md-icon>notifications_none</md-icon></button></div></header>
      {activeView === 'dashboard' ? <>
        <section className="greeting"><div><h2>Good morning, Jamie</h2><p>Here&apos;s what&apos;s happening with your job search.</p></div><button className="primary-button" onClick={() => setShowDialog(true)}><md-icon>add</md-icon> Add application</button></section>
        <section className="content-section metrics-section"><div className="section-header metrics-heading"><div><h2>Metrics</h2><p>A snapshot of your progress over time.</p></div><select className="range-filter" value={range} onChange={(event) => setRange(event.target.value as Range)} aria-label="Metric time range"><option>Today</option><option>This Week</option><option>This Month</option></select></div><div className="metrics-grid"><Metric icon="layers" label="Total applications" value={counts.total} change="+7.6%" comparison={comparison} positive /><Metric icon="send" label="Applied" value={counts.applied} change="+3.2%" comparison={comparison} positive /><Metric icon="calendar_month" label="Interviews" value={counts.interviews} change="-2.4%" comparison={comparison} positive={false} /><Metric icon="workspace_premium" label="Offers" value={counts.offers} change="+12.5%" comparison={comparison} positive /></div></section>
        <section className="content-section applications-section"><div className="section-header"><div><h2>Recent applications</h2><p>Your latest job applications at a glance.</p></div><button className="text-button" onClick={() => setActiveView('applications')}>View all <md-icon>arrow_forward</md-icon></button></div><ApplicationTable applications={applications.slice(0, 4)} onStatusChange={updateStatus} compact /></section>
      </> : <section className="content-section applications-section applications-view"><div className="toolbar"><label className="search-field"><md-icon>search</md-icon><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by company, role, or location" aria-label="Search applications" /></label><select className="status-filter" value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)} aria-label="Filter by status"><option>All statuses</option>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></div><ApplicationTable applications={filteredApplications} onStatusChange={updateStatus} /></section>}
    </main>
    {showDialog && <div className="dialog-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setShowDialog(false) }}><div className="dialog-card" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><div className="dialog-heading"><div><p className="eyebrow">NEW OPPORTUNITY</p><h2 id="dialog-title">Add application</h2></div><button className="icon-button" onClick={() => setShowDialog(false)} aria-label="Close dialog"><md-icon>close</md-icon></button></div><label className="form-label">Company<input value={newCompany} onChange={(event) => setNewCompany(event.target.value)} placeholder="e.g. Acme Inc." autoFocus /></label><label className="form-label">Role<input value={newRole} onChange={(event) => setNewRole(event.target.value)} placeholder="e.g. Product Designer" /></label><div className="dialog-actions"><button className="secondary-button" onClick={() => setShowDialog(false)}>Cancel</button><button className="primary-button" onClick={addApplication}>Save application</button></div></div></div>}
  </div>
}

function Metric({ icon, label, value, change, comparison, positive }: { icon: string; label: string; value: number; change: string; comparison: string; positive: boolean }) { return <article className="metric-card"><div className="metric-topline"><p>{label}</p><span className="metric-icon"><md-icon>{icon}</md-icon></span></div><strong>{value}</strong><div className="metric-comparison"><span className={`metric-change ${positive ? 'positive' : 'negative'}`}><md-icon>{positive ? 'north_east' : 'south_east'}</md-icon>{change}</span><small>{comparison}</small></div></article> }
function ApplicationTable({ applications, onStatusChange, compact = false }: { applications: Application[]; onStatusChange: (id: number, status: ApplicationStatus) => void; compact?: boolean }) { return <div className={`table-wrap ${compact ? 'compact-table' : ''}`}>{applications.length === 0 ? <div className="empty-state"><md-icon>search_off</md-icon><h3>No applications found</h3><p>Try a different search or filter.</p></div> : <table className="applications-table"><thead><tr><th>Company</th><th>Job title</th><th>Status</th><th>Location</th><th>Employment type</th><th>Date applied</th><th>Last updated</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{applications.map((application) => <tr key={application.id}><td><div className="company-cell"><span className={`company-logo ${application.color}`}>{application.initials}</span><strong>{application.company}</strong></div></td><td>{application.role}</td><td><select className={`status-pill ${application.status.toLowerCase()}`} value={application.status} onChange={(event) => onStatusChange(application.id, event.target.value as ApplicationStatus)} aria-label={`Status for ${application.company}`}><option>Applied</option><option>Interview</option><option>Offer</option><option>Rejected</option></select></td><td>{application.location}</td><td>{application.employment}</td><td>{application.date}</td><td>{application.updated}</td><td><button className="row-menu" aria-label={`More options for ${application.company}`}><md-icon>more_horiz</md-icon></button></td></tr>)}</tbody></table>}</div> }

const statusOptions: ApplicationStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected']
