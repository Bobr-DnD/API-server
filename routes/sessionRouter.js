import { getSessions, getSessionById, createSession, updateSession, deleteSession } from "../controllers/sessionController.js";

export default async function charactersRoute(fastify, opts) {
    fastify.get('/', getSessions);
    fastify.get('/:id', getSessionById);
    fastify.post('/', createSession);
    fastify.patch('/:id', updateSession);
    fastify.delete('/:id', deleteSession);
}
