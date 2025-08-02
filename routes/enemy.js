import Enemy from '../schemas/enemySchema.js'

export default async function enemyRoute(fastify, opts) {
    const enemies = () => fastify.mongo.db.collection('enemies')

    fastify.get('/', async (request, reply) => {
        const allEnemies = await enemies().find().toArray()
        return reply.code(200).send(allEnemies)
    })

    fastify.post('/', async (request, reply) => {
        try {
            const enemy = await Enemy.create(request.body)
            return reply.code(201).send(enemy)
        } catch (err) {
            return reply.code(400).send({ error: err.message })
        }
    })

    fastify.get('/:id', async (request, reply) => {
        let objectId
        try {
            objectId = new fastify.mongo.ObjectId(request.params.id)
        } catch (err) {
            return reply.code(400).send({ error: 'Invalid ID: must be a 24-character hex string' })
        }

        const enemy = await Enemy.findOne(objectId).populate('weapons').populate('armor').exec()
        if (!enemy) {
            return reply.code(404).send({ error: 'Enemy not found' })
        }

        return reply.code(200).send(enemy)
    })

    fastify.patch('/:id', async (request, reply) => {
        let objectId
        try {
            objectId = new fastify.mongo.ObjectId(request.params.id)
        } catch (err) {
            return reply.code(400).send({ error: 'Invalid ID format' })
        }

        const updatedEnemy = await Enemy.findByIdAndUpdate(objectId, request.body, { new: true, runValidators: true })

        console.log(updatedEnemy);

        if (!updatedEnemy) {
            return reply.code(404).send({ error: 'Enemy not found' })
        }

        return reply.code(200).send(updatedEnemy)
    })

    fastify.delete('/:id', async (request, reply) => {
        let objectId
        try {
            objectId = new fastify.mongo.ObjectId(request.params.id)
        } catch (err) {
            return reply.code(400).send({ error: 'Invalid ID format' })
        }

        const result = await enemies().deleteOne({ _id: objectId })

        if (result.deletedCount === 0) {
            return reply.code(404).send({ error: 'Enemy not found' })
        }

        return reply.send({ success: true })
    })
}
