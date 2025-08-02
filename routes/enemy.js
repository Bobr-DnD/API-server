import Enemy from '../schemas/enemySchema.js'
import {commonRoutes} from '../plugins/commonController.js'

export default async function enemyRoute(fastify, opts) {
    const enemies = () => fastify.mongo.db.collection('enemies')

    commonRoutes(fastify, {path:'/', model:Enemy, collection:enemies, skipMethods:['getById']})

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

}