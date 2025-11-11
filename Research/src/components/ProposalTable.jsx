export default function ProposalTable({ proposals, onDelete, onEdit }) {
  if (!proposals || proposals.length === 0) {
    return (
      <div className="empty-state">
        <h3>No proposals found</h3>
        <p>Start by adding your first research grant proposal.</p>
      </div>
    )
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatStatus = (status) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'draft': return 'status-draft'
      case 'submitted': return 'status-submitted'
      case 'under-review': return 'status-under-review'
      case 'approved': return 'status-approved'
      case 'rejected': return 'status-rejected'
      default: return 'status-default'
    }
  }

  const isOverdue = (deadline, status) => {
    const deadlineDate = new Date(deadline)
    const now = new Date()
    return deadlineDate < now && status !== 'approved' && status !== 'rejected'
  }

  return (
    <div className="proposals-grid">
      {proposals.map((proposal) => (
        <div key={proposal.id} className="proposal-card">
          <div className="proposal-header">
            <div className="proposal-info">
              <h3 className="proposal-title">{proposal.title}</h3>
              <p className="proposal-pi">PI: {proposal.principalInvestigator}</p>
            </div>
            <div className="proposal-actions">
              <button 
                className="btn btn-edit" 
                onClick={() => onEdit?.(proposal)}
                title="Edit proposal"
              >
                Edit
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => onDelete?.(proposal.id)}
                title="Delete proposal"
              >
                Delete
              </button>
            </div>
          </div>
          
          <div className="proposal-details">
            <div className="detail-row">
              <div className="detail-item">
                <span className="detail-label">Funding Agency:</span>
                <span className="detail-value">{proposal.fundingAgency}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Amount:</span>
                <span className="detail-value">{formatCurrency(proposal.requestedAmount)}</span>
              </div>
            </div>
            
            <div className="detail-row">
              <div className="detail-item">
                <span className="detail-label">Deadline:</span>
                <span className={`detail-value ${isOverdue(proposal.submissionDeadline, proposal.status) ? 'text-danger' : ''}`}>
                  {formatDate(proposal.submissionDeadline)}
                  {isOverdue(proposal.submissionDeadline, proposal.status) && (
                    <span className="overdue-badge"> (Overdue)</span>
                  )}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className={`status-badge ${getStatusClass(proposal.status)}`}>
                  {formatStatus(proposal.status)}
                </span>
              </div>
            </div>
          </div>
          
          {proposal.description && (
            <div className="proposal-description">
              <p>{proposal.description}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
