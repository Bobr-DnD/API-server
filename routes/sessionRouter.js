import { getSessions, getSessionById, createSession, updateSession, deleteSession, login } from "../controllers/sessionController.js";

export default async function charactersRoute(fastify, opts) {
    fastify.get('/', getSessions);
    fastify.get('/:id', getSessionById);
    fastify.post('/', createSession);
    fastify.post('/login/:id', login);
    fastify.patch('/:id', updateSession);
    fastify.delete('/:id', deleteSession);
}
