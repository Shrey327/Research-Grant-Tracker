require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { connectToDatabase } = require('./config/db')
const Usage = require('./models/Usage')
const Proposal = require('./models/Proposal')

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.get('/api/usages', async (req, res) => {
  try {
    const docs = await Usage.find({}).sort({ createdAt: -1 }).lean()
    const list = docs.map((d) => ({
      id: String(d._id),
      toolName: d.toolName,
      userName: d.userName,
      purpose: d.purpose || '',
      startAtIso: d.startAtIso,
      durationMinutes: d.durationMinutes,
      status: d.status || 'Active',
    }))
    res.json(list)
  } catch (err) {
    res.status(500).json({ error: 'Failed to load usages' })
  }
})

app.post('/api/usages', async (req, res) => {
  const body = req.body || {}
  if (!body.toolName || !body.userName || !body.startAtIso || !body.durationMinutes) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  try {
    const created = await Usage.create({
      toolName: String(body.toolName).trim(),
      userName: String(body.userName).trim(),
      purpose: String(body.purpose || '').trim(),
      startAtIso: String(body.startAtIso),
      durationMinutes: Number(body.durationMinutes),
      status: body.status || 'Active',
    })
    res.status(201).json({
      id: String(created._id),
      toolName: created.toolName,
      userName: created.userName,
      purpose: created.purpose || '',
      startAtIso: created.startAtIso,
      durationMinutes: created.durationMinutes,
      status: created.status || 'Active',
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to create usage' })
  }
})

app.delete('/api/usages/:id', async (req, res) => {
  const id = req.params.id
  try {
    await Usage.findByIdAndDelete(id)
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete usage' })
  }
})

app.delete('/api/usages', async (req, res) => {
  try {
    await Usage.deleteMany({})
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear usages' })
  }
})

// Proposal endpoints
app.get('/api/proposals', async (req, res) => {
  try {
    const docs = await Proposal.find({}).sort({ createdAt: -1 }).lean()
    const list = docs.map((d) => ({
      id: String(d._id),
      title: d.title,
      principalInvestigator: d.principalInvestigator,
      fundingAgency: d.fundingAgency,
      requestedAmount: d.requestedAmount,
      submissionDeadline: d.submissionDeadline,
      status: d.status,
      description: d.description || '',
      createdAt: d.createdAt,
      updatedAt: d.updatedAt
    }))
    res.json(list)
  } catch (err) {
    console.error('Error fetching proposals:', err)
    res.status(500).json({ error: 'Failed to load proposals' })
  }
})

app.post('/api/proposals', async (req, res) => {
  const body = req.body || {}
  if (!body.title || !body.principalInvestigator || !body.fundingAgency || 
      !body.requestedAmount || !body.submissionDeadline || !body.status) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  try {
    const created = await Proposal.create({
      title: String(body.title).trim(),
      principalInvestigator: String(body.principalInvestigator).trim(),
      fundingAgency: String(body.fundingAgency).trim(),
      requestedAmount: Number(body.requestedAmount),
      submissionDeadline: new Date(body.submissionDeadline),
      status: String(body.status),
      description: String(body.description || '').trim()
    })
    res.status(201).json({
      id: String(created._id),
      title: created.title,
      principalInvestigator: created.principalInvestigator,
      fundingAgency: created.fundingAgency,
      requestedAmount: created.requestedAmount,
      submissionDeadline: created.submissionDeadline,
      status: created.status,
      description: created.description || '',
      createdAt: created.createdAt,
      updatedAt: created.updatedAt
    })
  } catch (err) {
    console.error('Error creating proposal:', err)
    res.status(500).json({ error: 'Failed to create proposal' })
  }
})

app.put('/api/proposals/:id', async (req, res) => {
  const id = req.params.id
  const body = req.body || {}
  
  try {
    const updated = await Proposal.findByIdAndUpdate(id, {
      title: String(body.title || '').trim(),
      principalInvestigator: String(body.principalInvestigator || '').trim(),
      fundingAgency: String(body.fundingAgency || '').trim(),
      requestedAmount: Number(body.requestedAmount || 0),
      submissionDeadline: new Date(body.submissionDeadline),
      status: String(body.status || 'draft'),
      description: String(body.description || '').trim()
    }, { new: true })
    
    if (!updated) {
      return res.status(404).json({ error: 'Proposal not found' })
    }
    
    res.json({
      id: String(updated._id),
      title: updated.title,
      principalInvestigator: updated.principalInvestigator,
      fundingAgency: updated.fundingAgency,
      requestedAmount: updated.requestedAmount,
      submissionDeadline: updated.submissionDeadline,
      status: updated.status,
      description: updated.description || '',
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt
    })
  } catch (err) {
    console.error('Error updating proposal:', err)
    res.status(500).json({ error: 'Failed to update proposal' })
  }
})

app.delete('/api/proposals/:id', async (req, res) => {
  const id = req.params.id
  try {
    await Proposal.findByIdAndDelete(id)
    res.status(204).end()
  } catch (err) {
    console.error('Error deleting proposal:', err)
    res.status(500).json({ error: 'Failed to delete proposal' })
  }
})

app.delete('/api/proposals', async (req, res) => {
  try {
    await Proposal.deleteMany({})
    res.status(204).end()
  } catch (err) {
    console.error('Error clearing proposals:', err)
    res.status(500).json({ error: 'Failed to clear proposals' })
  }
})

// Simple probe to verify proposals routes are loaded in the running server
app.get('/api/proposals/ping', (req, res) => {
  res.json({ ok: true, feature: 'proposals' })
})

async function start() {
  try {
    await connectToDatabase(process.env.MONGODB_URI)
    app.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`)
      console.log('Routes mounted: /api/health, /api/usages, /api/proposals, /api/proposals/ping')
    })
  } catch (err) {
    console.error('Failed to start server:', err.message)
    process.exit(1)
  }
}

start()


