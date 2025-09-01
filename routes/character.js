import Character from '../schemas/characterSchema.js'
import Effect from '../schemas/effectSchema.js'
import { commonRoutes } from '../plugins/commonController.js'

export default async function charactersRoute(fastify, opts) {
    const characters = () => fastify.mongo.db.collection('characters')

    commonRoutes(fastify, { path: '/', model: Character, collection: characters, skipMethods: ['getById'] })

    fastify.get('/:id', async (request, reply) => {

        let objectId
        try {
            objectId = new fastify.mongo.ObjectId(request.params.id)
        } catch (err) {
            return reply.code(400).send({ error: 'Invalid ID: must be a 24-character hex string' })
        }

        const character = await Character.findById(objectId).populate(['weapons', 'armor', 'perks', 'effects', 'medicines', 'inventory', 'quest']).exec();

        await character.populate(['medicines.effect', 'medicines.addictionEffect', 'medicines.recipe'])

        character.effects = await Promise.all(
            character.effects.map(async (effect) => {
                effect.effect = await Effect.findById(effect.effect)
                return effect
            })
        )
        
        if (!character) {
            return reply.code(404).send({ error: 'Not found' })
        }

        return reply.code(200).send(character)
    })
}
