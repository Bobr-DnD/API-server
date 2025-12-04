import Fastify from 'fastify'
import dotenv from 'dotenv'
import cors from '@fastify/cors'
import db from './plugins/mongoDB.js'
import multipart from '@fastify/multipart'
import errorHandler from './plugins/errorHandler.js'
import charactersRoute from './routes/characterRouter.js'
import sessionRouter from './routes/sessionRouter.js'
import enemyRouter from './routes/enemyRouter.js'
import commonRouter from './routes/commonRouter.js'
import filesRouter from './routes/filesRouter.js'
import mongoosePlugin from './plugins/mongoose.js'
import customLogger from './plugins/logger.js'

dotenv.config({ path: './.env' })

const fastify = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss Z',
        ignore: 'pid,hostname,reqId,req,res,err,responseTime'
      }
    }
  },
  disableRequestLogging: true
})

await fastify.register(customLogger)
await fastify.register(cors, { origin: ['http://127.0.0.1:3000', 'http://localhost:3000', 'http://localhost:8080', 'http://127.0.0.1:8080', '*'], credentials: true })
await fastify.register(db, { use_local: process.env.DB_LOCAL === 'true' })
await fastify.register(mongoosePlugin, { use_local: process.env.DB_LOCAL === 'true' })
await fastify.register(errorHandler)

await fastify.register(multipart, {
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Register routes
fastify.register(charactersRoute, { prefix: '/character' })
fastify.register(sessionRouter, { prefix: '/session' })
fastify.register(enemyRouter, { prefix: '/enemy' })

fastify.register(commonRouter, {prefix: '/entity', model: 'Entity', collection: 'entities'})
fastify.register(commonRouter, { prefix: '/effect', model: 'Effect', collection: 'effects' })
fastify.register(commonRouter, { prefix: '/fraction', model: 'Fraction', collection: 'fractions' })
fastify.register(commonRouter, { prefix: '/perk', model: 'Perk', collection: 'perks' })
fastify.register(commonRouter, { prefix: '/quest', model: 'Quest', collection: 'quests' })
fastify.register(filesRouter, { prefix: '/storage' })


// Start server
const start = async () => {
  try {
    await fastify.listen({ port: process.env.API_PORT })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
