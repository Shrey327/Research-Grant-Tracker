import { useCallback, useMemo, useState } from 'react'

export default function ProposalForm({ onAdd, onUpdate, editingProposal, onCancel }) {
  const [title, setTitle] = useState(editingProposal?.title || '')
  const [principalInvestigator, setPrincipalInvestigator] = useState(editingProposal?.principalInvestigator || '')
  const [fundingAgency, setFundingAgency] = useState(editingProposal?.fundingAgency || '')
  const [requestedAmount, setRequestedAmount] = useState(editingProposal?.requestedAmount || '')
  const [submissionDeadline, setSubmissionDeadline] = useState(
    editingProposal?.submissionDeadline 
      ? new Date(editingProposal.submissionDeadline).toISOString().split('T')[0]
      : ''
  )
  const [status, setStatus] = useState(editingProposal?.status || 'draft')
  const [description, setDescription] = useState(editingProposal?.description || '')
  const [error, setError] = useState('')

  const isValid = useMemo(() => {
    return (
      title.trim() !== '' &&
      principalInvestigator.trim() !== '' &&
      fundingAgency.trim() !== '' &&
      Number(requestedAmount) > 0 &&
      submissionDeadline.trim() !== '' &&
      status.trim() !== ''
    )
  }, [title, principalInvestigator, fundingAgency, requestedAmount, submissionDeadline, status])

  const resetForm = useCallback(() => {
    setTitle('')
    setPrincipalInvestigator('')
    setFundingAgency('')
    setRequestedAmount('')
    setSubmissionDeadline('')
    setStatus('draft')
    setDescription('')
    setError('')
  }, [])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      if (!isValid) {
        setError('Please fill all required fields and enter a valid amount.')
        return
      }
      setError('')
      
      const proposalData = {
        title: title.trim(),
        principalInvestigator: principalInvestigator.trim(),
        fundingAgency: fundingAgency.trim(),
        requestedAmount: Number(requestedAmount),
        submissionDeadline: submissionDeadline,
        status,
        description: description.trim()
      }

      if (editingProposal) {
        onUpdate?.(editingProposal.id, proposalData)
      } else {
        onAdd?.(proposalData)
      }
      
      resetForm()
    },
    [isValid, title, principalInvestigator, fundingAgency, requestedAmount, submissionDeadline, status, description, editingProposal, onAdd, onUpdate, resetForm]
  )

  const handleCancel = useCallback(() => {
    resetForm()
    onCancel?.()
  }, [resetForm, onCancel])

  return (
    <form className="proposal-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Proposal Title*
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter proposal title"
            required
          />
        </label>
      </div>
      
      <div className="form-row">
        <label>
          Principal Investigator*
          <input
            type="text"
            value={principalInvestigator}
            onChange={(e) => setPrincipalInvestigator(e.target.value)}
            placeholder="Enter principal investigator name"
            required
          />
        </label>
        <label>
          Funding Agency*
          <input
            type="text"
            value={fundingAgency}
            onChange={(e) => setFundingAgency(e.target.value)}
            placeholder="Enter funding agency name"
            required
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Requested Amount ($)*
          <input
            type="number"
            min="0"
            step="0.01"
            value={requestedAmount}
            onChange={(e) => setRequestedAmount(e.target.value)}
            placeholder="0.00"
            required
          />
        </label>
        <label>
          Submission Deadline*
          <input
            type="date"
            value={submissionDeadline}
            onChange={(e) => setSubmissionDeadline(e.target.value)}
            required
          />
        </label>
        <label>
          Status*
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="under-review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
      </div>

      <div className="form-row">
        <label className="full-width">
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter proposal description (optional)"
            rows="4"
          />
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={!isValid} className="btn-primary">
          {editingProposal ? 'Update Proposal' : 'Save Proposal'}
        </button>
        {(editingProposal || onCancel) && (
          <button type="button" onClick={handleCancel} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
      
      {error && <p className="error">{error}</p>}
    </form>
  )
}
