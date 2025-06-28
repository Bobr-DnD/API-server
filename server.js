import Fastify from 'fastify'
import dotenv from 'dotenv'
import cors from '@fastify/cors'
import db from './plugins/mongoDB.js'
import charactersRoute from './routes/character.js'
import enemyRoute from './routes/enemy.js'
import medicineRoute from './routes/medicine.js'
import sessionRoute from './routes/session.js'
import genericRouteHandler from './routes/generic.js'
import mongoosePlugin from './plugins/mongoose.js'
import customLogger from './plugins/logger.js'

dotenv.config({ path: './config.env' })

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
  }
})

await fastify.register(customLogger)
await fastify.register(cors, { origin: ['http://127.0.0.1:8080', 'http://localhost:8080'], credentials: true })
await fastify.register(db, {use_local: process.env.DB_LOCAL === 'true'})
await fastify.register(mongoosePlugin, {use_local: process.env.DB_LOCAL === 'true'})

// Register routes
fastify.register(charactersRoute, { prefix: '/character' })
fastify.register(enemyRoute, {prefix: '/enemy'})
fastify.register(medicineRoute, {prefix: '/medicine'})
fastify.register(sessionRoute, {prefix: '/session'})

fastify.register(genericRouteHandler, {prefix: '/armor', model: 'Armor', collection: 'armors'})
fastify.register(genericRouteHandler, {prefix: '/effect', model: 'Effect', collection: 'effects'})
fastify.register(genericRouteHandler, {prefix: '/fraction', model: 'Fraction', collection: 'fractions'})
fastify.register(genericRouteHandler, {prefix: '/inventory', model: 'Inventory', collection: 'inventories'})
fastify.register(genericRouteHandler, {prefix: '/perk', model: 'Perk', collection: 'perks'})
fastify.register(genericRouteHandler, {prefix: '/quest', model: 'Quest', collection: 'quests'})
fastify.register(genericRouteHandler, {prefix: '/weapon', model: 'Weapon', collection: 'weapons'})

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: process.env.API_PORT})
    fastify.log.info(`Server running on http://localhost:${process.env.API_PORT}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
