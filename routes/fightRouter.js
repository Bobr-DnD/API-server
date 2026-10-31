import {
    getFights,
    getActiveFight,
    getFightById,
    createFight,
    updateFight,
    activateFight,
    deactivateFight,
    deleteFight
} from '../controllers/fightController.js'

export default async function fightRouter(fastify, opts) {
    fastify.get('/', { preHandler: fastify.requireAdmin }, getFights);
    fastify.get('/active', { preHandler: fastify.authenticate }, getActiveFight);
    fastify.get('/:id', { preHandler: fastify.requireAdmin }, getFightById);
    fastify.post('/', { preHandler: fastify.requireAdmin }, createFight);
    fastify.patch('/:id', { preHandler: fastify.requireAdmin }, updateFight);
    fastify.post('/:id/activate', { preHandler: fastify.requireAdmin }, activateFight);
    fastify.post('/:id/deactivate', { preHandler: fastify.requireAdmin }, deactivateFight);
    fastify.delete('/:id', { preHandler: fastify.requireAdmin }, deleteFight);
}
