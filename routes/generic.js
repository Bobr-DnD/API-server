import Armor from '../schemas/armorSchema.js'
import Effect from '../schemas/effectSchema.js'
import Fraction from '../schemas/fractionSchema.js'
import Inventory from '../schemas/inventorySchema.js'
import Perk from '../schemas/perkSchema.js'
import Quest from '../schemas/questSchema.js'
import Weapon from '../schemas/weaponsSchema.js'

export default async function genericRouteHandler(fastify, opts) {
    const collection = () => fastify.mongo.db.collection(opts.collection)
    const models = {
        Armor,
        Effect,
        Fraction,
        Inventory,
        Perk,
        Quest,
        Weapon
    }
    const model = models[opts.model]

    fastify.get('/', async (request, reply) => {
        const object = await collection().find().toArray()
        return reply.code(200).send(object)
    })

    fastify.post('/', async (request, reply) => {
        const object = await model.create(request.body)
        return reply.code(201).send(object)
    })

    fastify.get('/:id', async (request, reply) => {

        let objectId
        try {
            objectId = new fastify.mongo.ObjectId(request.params.id)
        } catch (err) {
            return reply.code(400).send({ error: 'Invalid ID: must be a 24-character hex string' })
        }

        const object = await collection().findOne({ _id: objectId })
        if (!object) {
            return reply.code(404).send({ error: `${opts.entity} not found` })
        }

        return reply.code(200).send(object)
    })

    fastify.patch('/:id', async (request, reply) => {
        let objectId
        try {
            objectId = new fastify.mongo.ObjectId(request.params.id)
        } catch (err) {
            return reply.code(400).send({ error: 'Invalid ID format' })
        }

        const object = await model.findByIdAndUpdate(objectId, request.body, { new: true, runValidators: true })

        if (!object) {
            return reply.code(404).send({ error: `${opts.entity} not found` })
        }

        return reply.code(200).send(object)
    })

    fastify.delete('/:id', async (request, reply) => {
        let objectId
        try {
            objectId = new fastify.mongo.ObjectId(request.params.id)
        } catch (err) {
            return reply.code(400).send({ error: 'Invalid ID format' })
        }

        const result = await collection().deleteOne({ _id: objectId })

        if (result.deletedCount === 0) {
            return reply.code(404).send({ error: `${opts.entity} not found` })
        }

        return reply.send({ success: true })
    })
}
