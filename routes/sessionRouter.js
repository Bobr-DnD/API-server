import { getSessions, getSessionNamesAndImages, getSessionById, getPlainSessionWithPlainCharacters, getPlainSessionWithEntitiesAndEffects, createSession, updateSession, deleteSession, login, changePassword } from "../controllers/sessionController.js";

export default async function charactersRoute(fastify, opts) {
    fastify.get('/details', getSessionNamesAndImages)
    fastify.get('/', getSessions);
    fastify.get('/:id', getSessionById);
    fastify.get('/plainWithPlainCharacters/:id', getPlainSessionWithPlainCharacters)
    fastify.get('/plainWithEntitiesAndEffects/:id', getPlainSessionWithEntitiesAndEffects)
    fastify.post('/', createSession);
    fastify.post('/login/:id', login);
    fastify.post('/changepass/:id', changePassword);
    fastify.patch('/:id', updateSession);
    fastify.delete('/:id', deleteSession);
}
