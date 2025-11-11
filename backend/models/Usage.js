const mongoose = require('mongoose')

const usageSchema = new mongoose.Schema(
  {
    toolName: { type: String, required: true, trim: true },
    userName: { type: String, required: true, trim: true },
    purpose: { type: String, default: '', trim: true },
    startAtIso: { type: String, required: true },
    durationMinutes: { type: Number, required: true, min: 0 },
    status: { type: String, default: 'Active' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Usage', usageSchema)


