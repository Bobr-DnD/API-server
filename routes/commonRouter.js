import Entity from '../schemas/entitySchema.js'
import Effect from '../schemas/effectSchema.js'
import Perk from '../schemas/perkSchema.js'
import { getEntities, getEntityById, createEntity, updateEntity, deleteEntity } from '../controllers/commonController.js'

export default async function commonRouter(fastify, opts) {
    const collection = () => fastify.mongo.db.collection(opts.collection)
    const models = {
        Entity,
        Effect,
        Perk,
    }
    const model = models[opts.model]
    
    fastify.get('/', { preHandler: fastify.authenticate }, getEntities(collection));
    fastify.get('/:id', { preHandler: fastify.authenticate }, getEntityById(collection));
    fastify.post('/', { preHandler: fastify.requireAdmin }, createEntity(model, opts.collection))
    fastify.patch('/:id', { preHandler: fastify.requireAdmin }, updateEntity(model))
    fastify.delete('/:id', { preHandler: fastify.requireAdmin }, deleteEntity(collection, opts.collection))
}
