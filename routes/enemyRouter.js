import { getEnemies, getEnemyById, updateEnemy, deleteEnemy, createEnemy } from '../controllers/enemyController.js'

export default async function charactersRoute(fastify, opts) {
    fastify.get('/', getEnemies);
    fastify.get('/:id', getEnemyById);
    fastify.post('/', createEnemy);
    fastify.patch('/:id', updateEnemy);
    fastify.delete('/:id', deleteEnemy);
}
