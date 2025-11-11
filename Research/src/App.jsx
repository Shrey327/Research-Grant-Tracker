import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import ProposalForm from './components/ProposalForm'
import ProposalTable from './components/ProposalTable'
import Kpis from './components/Kpis'
import { listProposals, createProposal, updateProposal, deleteProposal, clearAllProposals } from './api/client'

function App() {
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProposal, setEditingProposal] = useState(null)
  const [theme, setTheme] = useState('modern')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    listProposals()
      .then((data) => { if (!cancelled) setProposals(data) })
      .catch(() => { if (!cancelled) setError('Failed to load proposals') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  // Theme: load from storage
  useEffect(() => {
    const saved = localStorage.getItem('ui.theme') || 'modern'
    setTheme(saved)
  }, [])

  // Theme: apply to body and persist
  useEffect(() => {
    const classList = Array.from(document.body.classList)
    classList.filter(c => c.startsWith('theme-')).forEach(c => document.body.classList.remove(c))
    document.body.classList.add(`theme-${theme}`)
    localStorage.setItem('ui.theme', theme)
  }, [theme])

  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const addProposal = useCallback((proposalData) => {
    createProposal(proposalData)
      .then((created) => {
        setProposals((prev) => [created, ...prev])
        setShowForm(false)
        setError('')
      })
      .catch(() => setError('Failed to add proposal'))
  }, [])

  const updateProposalData = useCallback((id, proposalData) => {
    updateProposal(id, proposalData)
      .then((updated) => {
        setProposals((prev) => prev.map((p) => p.id === id ? updated : p))
        setEditingProposal(null)
        setShowForm(false)
        setError('')
      })
      .catch(() => setError('Failed to update proposal'))
  }, [])

  const deleteProposalData = useCallback((id) => {
    if (confirm('Are you sure you want to delete this proposal?')) {
      deleteProposal(id)
        .then(() => {
          setProposals((prev) => prev.filter((p) => p.id !== id))
          setError('')
        })
        .catch(() => setError('Failed to delete proposal'))
    }
  }, [])

  const clearAll = useCallback(() => {
    if (confirm('Clear all proposals?')) {
      clearAllProposals()
        .then(() => {
          setProposals([])
          setError('')
        })
        .catch(() => setError('Failed to clear proposals'))
    }
  }, [])

  const handleEdit = useCallback((proposal) => {
    setEditingProposal(proposal)
    setShowForm(true)
  }, [])

  const handleCancelForm = useCallback(() => {
    setShowForm(false)
    setEditingProposal(null)
  }, [])

  const filteredProposals = useMemo(() => {
    let list = proposals
    
    if (statusFilter.trim() !== '') {
      list = list.filter((p) => p.status === statusFilter)
    }
    
    if (searchText.trim() !== '') {
      const q = searchText.toLowerCase()
      list = list.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.principalInvestigator.toLowerCase().includes(q) ||
        p.fundingAgency.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      )
    }
    
    // Sort by newest first
    return [...list].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
  }, [proposals, statusFilter, searchText])

  return (
    <div className="container">
      <header className="header">
        <h1>Faculty Research Grant Proposal Tracker</h1>
        <div className="header-actions">
          <div className="theme-control">
            <label htmlFor="themeSelect">Theme</label>
            <select
              id="themeSelect"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="modern">Modern</option>
              <option value="minimalist">Minimalist</option>
              <option value="glass">Glassmorphism</option>
              <option value="neu">Neumorphism</option>
              <option value="brutalist">Brutalist</option>
              <option value="material">Material</option>
            </select>
          </div>
          <button 
            className="btn-primary" 
            onClick={() => setShowForm(true)}
            disabled={showForm}
          >
            Add New Proposal
          </button>
          <button 
            className="danger" 
            onClick={clearAll} 
            disabled={proposals.length === 0}
          >
            Clear All
          </button>
        </div>
      </header>

      {error && <p className="error">{error}</p>}
      
      <Kpis proposals={proposals} />

      {showForm && (
        <section className="card">
          <h2>{editingProposal ? 'Edit Proposal' : 'Add New Proposal'}</h2>
          <ProposalForm 
            onAdd={addProposal}
            onUpdate={updateProposalData}
            editingProposal={editingProposal}
            onCancel={handleCancelForm}
          />
        </section>
      )}

      <section className="card">
        <div className="filters">
          <input
            type="text"
            placeholder="Search by title, PI name, or funding agency..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="under-review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        {loading ? (
          <p className="muted">Loading proposals...</p>
        ) : (
          <ProposalTable 
            proposals={filteredProposals} 
            onDelete={deleteProposalData}
            onEdit={handleEdit}
          />
        )}
      </section>
    </div>
  )
}

export default App
