import Fastify from 'fastify'
import dotenv from 'dotenv'
import cors from '@fastify/cors'
import db from './plugins/mongoDB.js'
import errorHandler from './plugins/errorHandler.js'
import charactersRoute from './routes/characterRouter.js'
import sessionRouter from './routes/sessionRouter.js'
import enemyRouter from './routes/enemyRouter.js'
import medicineRouter from './routes/medicineRouter.js'
import commonRouter from './routes/commonRouter.js'
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
await fastify.register(cors, { origin: ['http://127.0.0.1:3000', 'http://localhost:3000'], credentials: true })
await fastify.register(db, {use_local: process.env.DB_LOCAL === 'true'})
await fastify.register(mongoosePlugin, {use_local: process.env.DB_LOCAL === 'true'})
await fastify.register(errorHandler)

// Register routes
fastify.register(charactersRoute, {prefix: '/character'})
fastify.register(sessionRouter, {prefix: '/session'})
fastify.register(enemyRouter, {prefix: '/enemy'})
fastify.register(medicineRouter, {prefix: '/medicine'})


fastify.register(commonRouter, {prefix: '/armor', model: 'Armor', collection: 'armors'})
fastify.register(commonRouter, {prefix: '/effect', model: 'Effect', collection: 'effects'})
fastify.register(commonRouter, {prefix: '/fraction', model: 'Fraction', collection: 'fractions'})
fastify.register(commonRouter, {prefix: '/inventory', model: 'Inventory', collection: 'inventories'})
fastify.register(commonRouter, {prefix: '/perk', model: 'Perk', collection: 'perks'})
fastify.register(commonRouter, {prefix: '/quest', model: 'Quest', collection: 'quests'})
fastify.register(commonRouter, {prefix: '/weapon', model: 'Weapon', collection: 'weapons'})

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: process.env.API_PORT})
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
