const mongoose = require('mongoose')

async function connectToDatabase(uri) {
  if (!uri) {
    throw new Error('Missing MONGODB_URI. Set it in environment variables.')
  }
  mongoose.set('strictQuery', true)
  await mongoose.connect(uri, {
    // Use default modern drivers; options kept minimal
  })
  return mongoose.connection
}

module.exports = { connectToDatabase }


