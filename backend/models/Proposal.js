const mongoose = require('mongoose')

const proposalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    principalInvestigator: { type: String, required: true, trim: true },
    fundingAgency: { type: String, required: true, trim: true },
    requestedAmount: { type: Number, required: true, min: 0 },
    submissionDeadline: { type: Date, required: true },
    status: { 
      type: String, 
      required: true,
      enum: ['draft', 'submitted', 'under-review', 'approved', 'rejected'],
      default: 'draft'
    },
    description: { type: String, default: '', trim: true }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Proposal', proposalSchema)
