import { getSessions, getSessionNamesAndImages, getSessionById, getPlainSessionWithPlainCharacters, getPlainSessionWithEntitiesAndEffects, createSession, updateSession, deleteSession, login } from "../controllers/sessionController.js";

export default async function charactersRoute(fastify, opts) {
    fastify.get('/details', getSessionNamesAndImages)
    fastify.get('/', getSessions);
    fastify.get('/:id', getSessionById);
    fastify.get('/plainWithPlainCharacters/:id', getPlainSessionWithPlainCharacters)
    fastify.get('/plainWithEntitiesAndEffects/:id', getPlainSessionWithEntitiesAndEffects)
    fastify.post('/', createSession);
    fastify.post('/login/:id', login);
    fastify.patch('/:id', updateSession);
    fastify.delete('/:id', deleteSession);
}
