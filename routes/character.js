import Character from '../schemas/characterSchema.js'
import {commonRoutes} from '../plugins/commonController.js'

export default async function charactersRoute(fastify, opts) {
    const characters = () => fastify.mongo.db.collection('characters')

    commonRoutes(fastify, {path:'/', model:Character, collection:characters, skipMethods:['getById']})

    fastify.get('/:id', async (request, reply) => {

        let objectId
        try {
            objectId = new fastify.mongo.ObjectId(request.params.id)
        } catch (err) {
            return reply.code(400).send({ error: 'Invalid ID: must be a 24-character hex string' })
        }

        const character = await Character.findById(objectId).populate('weapons')
            .populate('armor')
            .populate('perks')
            .populate('effects')
            .populate('medicines')
            .populate('inventory').exec();

        if (!character) {
            return character.code(404).send({ error: 'Not found' })
        }

        return reply.code(200).send(character)
    })
}
