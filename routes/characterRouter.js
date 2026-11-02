import { getCharacters, getCharacterById, updateCharacter, deleteCharacter, createCharacter } from '../controllers/characterController.js'

export default async function charactersRoute(fastify, opts) {
    fastify.get('/', { preHandler: fastify.authenticate }, getCharacters);
    fastify.get('/:id', { preHandler: fastify.authenticate }, getCharacterById);
    fastify.post('/', { preHandler: fastify.requireAdmin }, createCharacter);
    fastify.patch('/:id', { preHandler: fastify.requireAdmin }, updateCharacter);
    fastify.delete('/:id', { preHandler: fastify.requireAdmin }, deleteCharacter);
}
