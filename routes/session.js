import Session from '../schemas/sessionSchema.js'

export default async function sessionRoute(fastify, opts) {
    const sessions = () => fastify.mongo.db.collection('sessions')

    fastify.get('/', async (request, reply) => {
        const allSessions = await sessions().find().toArray()
        return reply.code(200).send(allSessions)
    })

    fastify.post('/', async (request, reply) => {
        const session = await Session.create(request.body)
        return reply.code(201).send(session)
    })

    fastify.get('/:id', async (request, reply) => {
        let objectId
        try {
            objectId = new fastify.mongo.ObjectId(request.params.id)
        } catch (err) {
            return reply.code(400).send({ error: 'Invalid ID format' })
        }

        const session = await sessions().findOne({ _id: objectId })
        if (!session) {
            return reply.code(404).send({ error: 'Session not found' })
        }

        return reply.code(200).send(session)
    })

    fastify.patch('/:id', async (request, reply) => {
        let objectId
        try {
            objectId = new fastify.mongo.ObjectId(request.params.id)
        } catch (err) {
            return reply.code(400).send({ error: 'Invalid ID format' })
        }

        const updatedSession = await Session.findByIdAndUpdate(objectId, request.body, { new: true, runValidators: true })

        if (!updatedSession) {
            return reply.code(404).send({ error: 'Session not found' })
        }

        return reply.code(200).send(updatedSession)
    })

    fastify.delete('/:id', async (request, reply) => {
        let objectId
        try {
            objectId = new fastify.mongo.ObjectId(request.params.id)
        } catch (err) {
            return reply.code(400).send({ error: 'Invalid ID format' })
        }

        const result = await sessions().deleteOne({ _id: objectId })

        if (result.deletedCount === 0) {
            return reply.code(404).send({ error: 'Session not found' })
        }

        return reply.send({ success: true })
    })
}
