export default function Kpis({ proposals }) {
  const totalProposals = proposals.length
  const approvedProposals = proposals.filter((p) => p.status === 'approved').length
  const pendingProposals = proposals.filter((p) => 
    ['draft', 'submitted', 'under-review'].includes(p.status)
  ).length
  const totalFunding = proposals
    .filter((p) => p.status === 'approved')
    .reduce((sum, p) => sum + Number(p.requestedAmount || 0), 0)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="kpis">
      <div className="kpi">
        <div className="kpi-title">Total Proposals</div>
        <div className="kpi-value">{totalProposals}</div>
      </div>
      <div className="kpi">
        <div className="kpi-title">Approved</div>
        <div className="kpi-value">{approvedProposals}</div>
      </div>
      <div className="kpi">
        <div className="kpi-title">Pending</div>
        <div className="kpi-value">{pendingProposals}</div>
      </div>
      <div className="kpi">
        <div className="kpi-title">Total Funding</div>
        <div className="kpi-value">{formatCurrency(totalFunding)}</div>
      </div>
    </div>
  )
}


