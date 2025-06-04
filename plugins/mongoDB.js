import fp from 'fastify-plugin'
import mongo from '@fastify/mongodb'

export default fp(async (fastify, opts) => {
  await fastify.register(mongo, {
    forceClose: true,
    url: process.env.MONGO_URL_WEB
  })

  fastify.log.info('MongoDB connected')
})
