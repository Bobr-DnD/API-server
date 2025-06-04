import fp from 'fastify-plugin'
import mongoose from 'mongoose'

async function dbConnector(fastify, opts) {
  try {
    await mongoose.connect(process.env.MONGO_URL_WEB)
    fastify.log.info('MongoDB connected')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }

  fastify.decorate('mongoose', mongoose)
}

export default fp(dbConnector)
