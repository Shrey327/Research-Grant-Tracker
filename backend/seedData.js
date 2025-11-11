require('dotenv').config()
const { connectToDatabase } = require('./config/db')
const Proposal = require('./models/Proposal')

const sampleProposals = [
  {
    title: 'Machine Learning Applications in Climate Research',
    principalInvestigator: 'Dr. Sarah Johnson',
    fundingAgency: 'National Science Foundation',
    requestedAmount: 250000,
    submissionDeadline: new Date('2024-12-15'),
    status: 'submitted',
    description: 'This project aims to develop novel machine learning algorithms for analyzing climate data patterns and predicting future climate scenarios.'
  },
  {
    title: 'Sustainable Energy Storage Solutions',
    principalInvestigator: 'Dr. Michael Chen',
    fundingAgency: 'Department of Energy',
    requestedAmount: 500000,
    submissionDeadline: new Date('2024-11-30'),
    status: 'under-review',
    description: 'Research into next-generation battery technologies for renewable energy storage systems.'
  },
  {
    title: 'Biomedical Imaging Enhancement',
    principalInvestigator: 'Dr. Emily Rodriguez',
    fundingAgency: 'National Institutes of Health',
    requestedAmount: 350000,
    submissionDeadline: new Date('2024-10-20'),
    status: 'approved',
    description: 'Development of advanced imaging techniques for early disease detection and diagnosis.'
  },
  {
    title: 'Quantum Computing Applications in Cryptography',
    principalInvestigator: 'Dr. David Kumar',
    fundingAgency: 'National Security Agency',
    requestedAmount: 750000,
    submissionDeadline: new Date('2025-01-15'),
    status: 'draft',
    description: 'Exploring quantum computing applications for next-generation cryptographic systems.'
  },
  {
    title: 'Urban Air Quality Monitoring Network',
    principalInvestigator: 'Dr. Lisa Park',
    fundingAgency: 'Environmental Protection Agency',
    requestedAmount: 180000,
    submissionDeadline: new Date('2024-09-30'),
    status: 'rejected',
    description: 'Implementation of IoT-based air quality monitoring systems across urban environments.'
  }
]

async function seedDatabase() {
  try {
    await connectToDatabase(process.env.MONGODB_URI)
    console.log('Connected to database')
    
    // Clear existing proposals
    await Proposal.deleteMany({})
    console.log('Cleared existing proposals')
    
    // Insert sample proposals
    const created = await Proposal.insertMany(sampleProposals)
    console.log(`Created ${created.length} sample proposals`)
    
    console.log('Sample proposals:')
    created.forEach((proposal, index) => {
      console.log(`${index + 1}. ${proposal.title} - ${proposal.status}`)
    })
    
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
