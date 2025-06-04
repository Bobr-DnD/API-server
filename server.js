import Fastify from 'fastify'
import dotenv from 'dotenv'
import cors from '@fastify/cors'
import db from './plugins/mongoDB.js'
import charactersRoutes from './routes/characters.js'
import mongoosePlugin from './plugins/mongoose.js'

dotenv.config({ path: './config.env' })

const fastify = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss Z',
        ignore: 'pid,hostname,reqId,req,res,err,responseTime',
        messageFormat: '{req.method} {req.url} → {res.statusCode}; {err.type} -> {err.message}'
      }
    }
  }
})

await fastify.register(cors, { origin: ['http://127.0.0.1:8080', 'http://localhost:8080'], credentials: true })
await fastify.register(db)
await fastify.register(mongoosePlugin)

// Register routes
fastify.register(charactersRoutes, { prefix: '/characters' })

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: process.env.API_PORT})
    console.log(`Server running on http://localhost:${process.env.API_PORT}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
