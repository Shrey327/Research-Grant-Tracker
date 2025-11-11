// Theme handling
const THEME_KEY = 'ui.theme';
const DEFAULT_THEME = 'modern';

function applyTheme(theme) {
    const classList = Array.from(document.body.classList);
    classList.filter(c => c.startsWith('theme-')).forEach(c => document.body.classList.remove(c));
    document.body.classList.add(`theme-${theme}`);
}

(function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
    applyTheme(saved);
    const select = document.getElementById('themeSelect');
    if (select) {
        select.value = saved;
        select.addEventListener('change', (e) => {
            const value = e.target.value;
            applyTheme(value);
            localStorage.setItem(THEME_KEY, value);
        });
    }
})();

class ProposalTracker {
    constructor() {
        this.proposals = JSON.parse(localStorage.getItem('proposals')) || [];
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderProposals();
        this.updateStats();
    }

    bindEvents() {
        // Modal events
        document.getElementById('addProposalBtn').addEventListener('click', () => this.openModal());
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        
        // Form submission
        document.getElementById('proposalForm').addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Filter events
        document.getElementById('statusFilter').addEventListener('change', () => this.filterProposals());
        document.getElementById('searchInput').addEventListener('input', () => this.filterProposals());
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('proposalModal');
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    openModal(proposal = null) {
        const modal = document.getElementById('proposalModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('proposalForm');
        
        if (proposal) {
            modalTitle.textContent = 'Edit Proposal';
            this.currentEditId = proposal.id;
            this.populateForm(proposal);
        } else {
            modalTitle.textContent = 'Add New Proposal';
            this.currentEditId = null;
            form.reset();
        }
        
        modal.style.display = 'block';
    }

    closeModal() {
        document.getElementById('proposalModal').style.display = 'none';
        document.getElementById('proposalForm').reset();
        this.currentEditId = null;
    }

    populateForm(proposal) {
        document.getElementById('title').value = proposal.title;
        document.getElementById('principalInvestigator').value = proposal.principalInvestigator;
        document.getElementById('fundingAgency').value = proposal.fundingAgency;
        document.getElementById('requestedAmount').value = proposal.requestedAmount;
        document.getElementById('submissionDeadline').value = proposal.submissionDeadline;
        document.getElementById('status').value = proposal.status;
        document.getElementById('description').value = proposal.description || '';
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('title').value,
            principalInvestigator: document.getElementById('principalInvestigator').value,
            fundingAgency: document.getElementById('fundingAgency').value,
            requestedAmount: parseFloat(document.getElementById('requestedAmount').value),
            submissionDeadline: document.getElementById('submissionDeadline').value,
            status: document.getElementById('status').value,
            description: document.getElementById('description').value
        };

        if (this.currentEditId) {
            this.updateProposal(this.currentEditId, formData);
        } else {
            this.addProposal(formData);
        }

        this.closeModal();
        this.renderProposals();
        this.updateStats();
        this.saveToStorage();
    }

    addProposal(proposalData) {
        const proposal = {
            id: Date.now().toString(),
            ...proposalData,
            createdAt: new Date().toISOString()
        };
        
        this.proposals.push(proposal);
    }

    updateProposal(id, proposalData) {
        const index = this.proposals.findIndex(p => p.id === id);
        if (index !== -1) {
            this.proposals[index] = {
                ...this.proposals[index],
                ...proposalData,
                updatedAt: new Date().toISOString()
            };
        }
    }

    deleteProposal(id) {
        if (confirm('Are you sure you want to delete this proposal?')) {
            this.proposals = this.proposals.filter(p => p.id !== id);
            this.renderProposals();
            this.updateStats();
            this.saveToStorage();
        }
    }

    filterProposals() {
        const statusFilter = document.getElementById('statusFilter').value;
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        
        let filteredProposals = this.proposals;
        
        if (statusFilter) {
            filteredProposals = filteredProposals.filter(p => p.status === statusFilter);
        }
        
        if (searchTerm) {
            filteredProposals = filteredProposals.filter(p => 
                p.title.toLowerCase().includes(searchTerm) ||
                p.principalInvestigator.toLowerCase().includes(searchTerm) ||
                p.fundingAgency.toLowerCase().includes(searchTerm)
            );
        }
        
        this.renderProposals(filteredProposals);
    }

    renderProposals(proposalsToRender = this.proposals) {
        const container = document.getElementById('proposalsList');
        
        if (proposalsToRender.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No proposals found</h3>
                    <p>Start by adding your first research grant proposal.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = proposalsToRender.map(proposal => this.createProposalCard(proposal)).join('');
    }

    createProposalCard(proposal) {
        const deadlineDate = new Date(proposal.submissionDeadline);
        const isOverdue = deadlineDate < new Date() && proposal.status !== 'approved' && proposal.status !== 'rejected';
        const formattedDeadline = deadlineDate.toLocaleDateString();
        const formattedAmount = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(proposal.requestedAmount);

        return `
            <div class="proposal-card">
                <div class="proposal-header">
                    <div>
                        <div class="proposal-title">${proposal.title}</div>
                        <div class="proposal-pi">PI: ${proposal.principalInvestigator}</div>
                    </div>
                    <div class="proposal-actions">
                        <button class="btn btn-edit" onclick="tracker.openModal(${JSON.stringify(proposal).replace(/"/g, '&quot;')})">Edit</button>
                        <button class="btn btn-danger" onclick="tracker.deleteProposal('${proposal.id}')">Delete</button>
                    </div>
                </div>
                
                <div class="proposal-details">
                    <div class="detail-item">
                        <div class="detail-label">Funding Agency</div>
                        <div class="detail-value">${proposal.fundingAgency}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Requested Amount</div>
                        <div class="detail-value">${formattedAmount}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Deadline</div>
                        <div class="detail-value ${isOverdue ? 'text-danger' : ''}">${formattedDeadline}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Status</div>
                        <div class="detail-value">
                            <span class="status-badge status-${proposal.status}">${this.formatStatus(proposal.status)}</span>
                        </div>
                    </div>
                </div>
                
                ${proposal.description ? `
                    <div class="proposal-description">
                        ${proposal.description}
                    </div>
                ` : ''}
            </div>
        `;
    }

    formatStatus(status) {
        return status.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    updateStats() {
        const total = this.proposals.length;
        const approved = this.proposals.filter(p => p.status === 'approved').length;
        const pending = this.proposals.filter(p => 
            ['draft', 'submitted', 'under-review'].includes(p.status)
        ).length;
        const totalFunding = this.proposals
            .filter(p => p.status === 'approved')
            .reduce((sum, p) => sum + p.requestedAmount, 0);

        document.getElementById('totalProposals').textContent = total;
        document.getElementById('approvedProposals').textContent = approved;
        document.getElementById('pendingProposals').textContent = pending;
        document.getElementById('totalFunding').textContent = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(totalFunding);
    }

    saveToStorage() {
        localStorage.setItem('proposals', JSON.stringify(this.proposals));
    }

    // Sample data for demonstration
    loadSampleData() {
        if (this.proposals.length === 0) {
            const sampleProposals = [
                {
                    id: '1',
                    title: 'Machine Learning Applications in Climate Research',
                    principalInvestigator: 'Dr. Sarah Johnson',
                    fundingAgency: 'National Science Foundation',
                    requestedAmount: 250000,
                    submissionDeadline: '2024-12-15',
                    status: 'submitted',
                    description: 'This project aims to develop novel machine learning algorithms for analyzing climate data patterns.',
                    createdAt: new Date().toISOString()
                },
                {
                    id: '2',
                    title: 'Sustainable Energy Storage Solutions',
                    principalInvestigator: 'Dr. Michael Chen',
                    fundingAgency: 'Department of Energy',
                    requestedAmount: 500000,
                    submissionDeadline: '2024-11-30',
                    status: 'under-review',
                    description: 'Research into next-generation battery technologies for renewable energy storage.',
                    createdAt: new Date().toISOString()
                },
                {
                    id: '3',
                    title: 'Biomedical Imaging Enhancement',
                    principalInvestigator: 'Dr. Emily Rodriguez',
                    fundingAgency: 'National Institutes of Health',
                    requestedAmount: 350000,
                    submissionDeadline: '2024-10-20',
                    status: 'approved',
                    description: 'Development of advanced imaging techniques for early disease detection.',
                    createdAt: new Date().toISOString()
                }
            ];
            
            this.proposals = sampleProposals;
            this.saveToStorage();
            this.renderProposals();
            this.updateStats();
        }
    }
}

// Initialize the application
const tracker = new ProposalTracker();

// Load sample data on first visit
tracker.loadSampleData();