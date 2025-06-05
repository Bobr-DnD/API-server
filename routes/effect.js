import Effect from '../schemas/effectSchema.js'

export default async function effectRoute(fastify, opts) {
    const effects = () => fastify.mongo.db.collection('effects')

    fastify.get('/', async (request, reply) => {
        const allEffects = await effects().find().toArray()
        return reply.code(200).send(allEffects)
    })

    fastify.post('/', async (request, reply) => {
        const effect = await Effect.create(request.body)
        return reply.code(201).send(effect)
    })

    fastify.get('/:id', async (request, reply) => {
        let objectId
        try {
            objectId = new fastify.mongo.ObjectId(request.params.id)
        } catch (err) {
            return reply.code(400).send({ error: 'Invalid ID: must be a 24-character hex string' })
        }

        const effect = await effects().findOne({ _id: objectId })
        if (!effect) {
            return reply.code(404).send({ error: 'Effect not found' })
        }

        return reply.code(200).send(effect)
    })

    fastify.patch('/:id', async (request, reply) => {
        let objectId
        try {
            objectId = new fastify.mongo.ObjectId(request.params.id)
        } catch (err) {
            return reply.code(400).send({ error: 'Invalid ID: must be a 24-character hex string' })
        }

        const updatedEffect = await Effect.findByIdAndUpdate(objectId, request.body, { new: true, runValidators: true })

        if (!updatedEffect) {
            return reply.code(404).send({ error: 'Effect not found' })
        }

        return reply.code(201).send(updatedEffect)
    })

    fastify.delete('/:id', async (request, reply) => {
        let objectId
        try {
            objectId = new fastify.mongo.ObjectId(request.params.id)
        } catch (err) {
            return reply.code(400).send({ error: 'Invalid ID: must be a 24-character hex string' })
        }

        const result = await effects().deleteOne({ _id: objectId })

        if (result.deletedCount === 0) {
            return reply.code(404).send({ error: 'Effect not found' })
        }

        return reply.send({ success: true })
    })
}
