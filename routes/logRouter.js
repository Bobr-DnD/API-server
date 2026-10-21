import { getLogs } from '../controllers/logController.js'

export default async function logRouter(fastify, opts) {
    fastify.get('/', getLogs);
}
