import Session from '../schemas/sessionSchema.js'
import { commonRoutes } from '../plugins/commonController.js'

export default async function sessionRoute(fastify, opts) {
    const sessions = () => fastify.mongo.db.collection('sessions')

    commonRoutes(fastify, { path: '/', model: Session, collection: sessions, skipMethods: ['getById'] })

    fastify.get('/:id', async (request, reply) => {
        let objectId
        try {
            objectId = new fastify.mongo.ObjectId(request.params.id)
        } catch (err) {
            return reply.code(400).send({ error: 'Invalid ID format' })
        }

        const session = await Session.findOne(objectId).populate(['characters', 'fractions', 'quests', 'armors', 'enemies', 'perks', 'inventories', 'medicines', 'weapons', 'effects']).exec()
        await session.populate(['characters.weapons', 'characters.armor', 'characters.perks', 'characters.effects', 'characters.medicines', 'characters.inventory', 'characters.quest'])
        if (!session) {
            return reply.code(404).send({ error: 'Session not found' })
        }

        return reply.code(200).send(session)
    })

}