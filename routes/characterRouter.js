import { getCharacters, getCharacterById, updateCharacter, deleteCharacter, createCharacter } from '../controllers/characterController.js'

export default async function charactersRoute(fastify, opts) {
    fastify.get('/', getCharacters);
    fastify.get('/:id', getCharacterById);
    fastify.post('/', createCharacter);
    fastify.patch('/:id', updateCharacter);
    fastify.delete('/:id', deleteCharacter);
}
