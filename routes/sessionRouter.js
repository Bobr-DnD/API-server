import { getSessions, getSessionNamesAndImages, getSessionById, getPlainSessionWithPlainCharacters, getPlainSessionWithEntitiesAndEffects, createSession, updateSession, deleteSession, login, changePassword } from "../controllers/sessionController.js";

export default async function charactersRoute(fastify, opts) {
    const sameSession = fastify.requireSessionParam('id')

    fastify.get('/details', getSessionNamesAndImages)
    fastify.get('/', { preHandler: fastify.authenticate }, getSessions);
    fastify.get('/:id', { preHandler: [fastify.authenticate, sameSession] }, getSessionById);
    fastify.get('/plainWithPlainCharacters/:id', { preHandler: [fastify.authenticate, sameSession] }, getPlainSessionWithPlainCharacters)
    fastify.get('/plainWithEntitiesAndEffects/:id', { preHandler: [fastify.authenticate, sameSession] }, getPlainSessionWithEntitiesAndEffects)
    fastify.post('/', createSession);
    fastify.post('/login/:id', login);
    fastify.post('/changepass/:id', changePassword);
    fastify.patch('/:id', { preHandler: [fastify.requireAdmin, sameSession] }, updateSession);
    fastify.delete('/:id', { preHandler: [fastify.requireAdmin, sameSession] }, deleteSession);
}
