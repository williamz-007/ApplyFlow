'use client'

import { useMemo, useState } from 'react'
import './home.css'

type ApplicationStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected'

type Application = {
  id: number
  company: string
  role: string
  date: string
  status: ApplicationStatus
  initials: string
  color: string
}

const initialApplications: Application[] = [
  { id: 1, company: 'Notion', role: 'Product Designer', date: 'Mar 18, 2024', status: 'Interview', initials: 'N', color: 'lavender' },
  { id: 2, company: 'Linear', role: 'Senior Product Designer', date: 'Mar 15, 2024', status: 'Applied', initials: 'L', color: 'blue' },
  { id: 3, company: 'Vercel', role: 'Product Designer', date: 'Mar 12, 2024', status: 'Offer', initials: 'V', color: 'black' },
  { id: 4, company: 'Figma', role: 'Design Engineer', date: 'Mar 08, 2024', status: 'Rejected', initials: 'F', color: 'purple' },
  { id: 5, company: 'Ramp', role: 'Product Designer', date: 'Mar 05, 2024', status: 'Applied', initials: 'R', color: 'green' },
  { id: 6, company: 'Arc', role: 'Product Designer', date: 'Mar 02, 2024', status: 'Applied', initials: 'A', color: 'orange' },
]

const statusOptions: ApplicationStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected']

export default function HomePage() {
  const [applications, setApplications] = useState(initialApplications)
  const [activeView, setActiveView] = useState<'dashboard' | 'applications'>('dashboard')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'All statuses' | ApplicationStatus>('All statuses')
  const [showDialog, setShowDialog] = useState(false)
  const [newCompany, setNewCompany] = useState('')
  const [newRole, setNewRole] = useState('')

  const filteredApplications = useMemo(() => applications.filter((application) => {
    const matchesQuery = `${application.company} ${application.role}`.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = filter === 'All statuses' || application.status === filter
    return matchesQuery && matchesStatus
  }), [applications, query, filter])

  const updateStatus = (id: number, status: ApplicationStatus) => {
    setApplications((items) => items.map((item) => item.id === id ? { ...item, status } : item))
  }

  const addApplication = () => {
    if (!newCompany.trim() || !newRole.trim()) return
    setApplications((items) => [{
      id: Date.now(), company: newCompany.trim(), role: newRole.trim(), date: 'Today', status: 'Applied',
      initials: newCompany.trim().slice(0, 1).toUpperCase(), color: 'blue',
    }, ...items])
    setNewCompany(''); setNewRole(''); setShowDialog(false)
  }

  const counts = {
    total: applications.length,
    interviews: applications.filter((item) => item.status === 'Interview').length,
    offers: applications.filter((item) => item.status === 'Offer').length,
    response: Math.round((applications.filter((item) => item.status !== 'Applied').length / applications.length) * 100),
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="brand" href="#top" aria-label="ApplyFlow home"><span className="brand-mark">A</span><span>ApplyFlow</span></a>
        <nav className="main-nav" aria-label="Main navigation">
          <button className={activeView === 'dashboard' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveView('dashboard')}>Dashboard</button>
          <button className={activeView === 'applications' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveView('applications')}>Applications</button>
        </nav>
        <div className="header-actions"><button className="icon-button" aria-label="Notifications"><md-icon>notifications</md-icon></button><button className="avatar" aria-label="Open profile">JD</button></div>
      </header>

      <main id="top" className="main-content">
        <div className="content-heading">
          <div><p className="eyebrow">MONDAY, MARCH 25, 2024</p><h1>{activeView === 'dashboard' ? 'Good morning, Jamie' : 'Applications'}</h1><p className="heading-copy">{activeView === 'dashboard' ? "Here's what's happening with your job search." : 'Keep every opportunity organized and moving forward.'}</p></div>
          <button className="primary-button" onClick={() => setShowDialog(true)}><md-icon>add</md-icon> Add application</button>
        </div>

        {activeView === 'dashboard' ? <>
          <section className="metrics-grid" aria-label="Application summary">
            <article className="metric-card"><span className="metric-icon blue-icon"><md-icon>work</md-icon></span><div><p>Total applications</p><strong>{counts.total}</strong><small>+2 this week</small></div></article>
            <article className="metric-card"><span className="metric-icon yellow-icon"><md-icon>event</md-icon></span><div><p>Interviews</p><strong>{counts.interviews}</strong><small>Keep it up</small></div></article>
            <article className="metric-card"><span className="metric-icon green-icon"><md-icon>celebration</md-icon></span><div><p>Offers</p><strong>{counts.offers}</strong><small>Great progress</small></div></article>
            <article className="metric-card"><span className="metric-icon purple-icon"><md-icon>trending_up</md-icon></span><div><p>Response rate</p><strong>{counts.response}%</strong><small>+8% vs last month</small></div></article>
          </section>
          <section className="section-block"><div className="section-header"><div><h2>Recent applications</h2><p>Your latest job applications at a glance.</p></div><button className="text-button" onClick={() => setActiveView('applications')}>View all <md-icon>arrow_forward</md-icon></button></div><ApplicationList applications={applications.slice(0, 4)} onStatusChange={updateStatus} /></section>
          <section className="tip-card"><span className="tip-icon"><md-icon>lightbulb</md-icon></span><div><h3>Stay organized, stay ahead</h3><p>Track your follow-ups and keep your momentum going. You&apos;ve got this.</p></div><md-icon className="tip-arrow">arrow_forward</md-icon></section>
        </> : <section className="section-block applications-view"><div className="toolbar"><label className="search-field"><md-icon>search</md-icon><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search applications" aria-label="Search applications" /></label><select className="status-filter" value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)} aria-label="Filter by status"><option>All statuses</option>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></div><ApplicationList applications={filteredApplications} onStatusChange={updateStatus} /></section>}
      </main>

      {showDialog && <div className="dialog-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setShowDialog(false) }}><div className="dialog-card" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><div className="dialog-heading"><div><p className="eyebrow">NEW OPPORTUNITY</p><h2 id="dialog-title">Add application</h2></div><button className="icon-button" onClick={() => setShowDialog(false)} aria-label="Close dialog"><md-icon>close</md-icon></button></div><label className="form-label">Company<input value={newCompany} onChange={(event) => setNewCompany(event.target.value)} placeholder="e.g. Acme Inc." autoFocus /></label><label className="form-label">Role<input value={newRole} onChange={(event) => setNewRole(event.target.value)} placeholder="e.g. Product Designer" /></label><div className="dialog-actions"><button className="secondary-button" onClick={() => setShowDialog(false)}>Cancel</button><button className="primary-button" onClick={addApplication}>Save application</button></div></div></div>}
    </div>
  )
}

function ApplicationList({ applications, onStatusChange }: { applications: Application[]; onStatusChange: (id: number, status: ApplicationStatus) => void }) {
  return <div className="application-list">{applications.length === 0 ? <div className="empty-state"><md-icon>search_off</md-icon><h3>No applications found</h3><p>Try a different search or filter.</p></div> : applications.map((application) => <article className="application-row" key={application.id}><span className={`company-logo ${application.color}`}>{application.initials}</span><div className="company-info"><strong>{application.company}</strong><span>{application.role}</span></div><span className="application-date">{application.date}</span><select className={`status-pill ${application.status.toLowerCase()}`} value={application.status} onChange={(event) => onStatusChange(application.id, event.target.value as ApplicationStatus)} aria-label={`Status for ${application.company}`}><option>Applied</option><option>Interview</option><option>Offer</option><option>Rejected</option></select><button className="row-menu" aria-label={`More options for ${application.company}`}><md-icon>more_horiz</md-icon></button></article>)}</div>
}
