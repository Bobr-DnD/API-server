import fp from 'fastify-plugin'
import mongo from '@fastify/mongodb'

export default fp(async (fastify, opts) => {
  const mongoUrl = opts.use_local ? process.env.MONGO_URL_LOCAL : process.env.MONGO_URL_WEB
  await fastify.register(mongo, {
    forceClose: true,
    url: mongoUrl
  })

  fastify.log.info(`MongoDB connected using ${opts.use_local ? 'LOCAL' : 'WEB'} URL`)
})
