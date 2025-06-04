import Character from '../schemas/characterSchema.js'
import Weapon from '../schemas/weaponsSchema.js'
import Armor from '../schemas/armorSchema.js'
import Perk from '../schemas/perkSchema.js'
import Medicine from '../schemas/medicinesSchema.js'
import Effect from '../schemas/effectSchema.js'
import Inventory from '../schemas/inventorySchema.js'

export default async function charactersRoutes(fastify, opts) {
    const characters = () => fastify.mongo.db.collection('characters')

    fastify.get('/', async (request, reply) => {
        const chs = await characters().find().toArray()
        reply.code(200).send(chs)
    })

    fastify.post('/', async (request, reply) => {

        const character = await Character.create(request.body)

        return reply.code(201).send(character)
    })

    fastify.get('/:id', async (request, reply) => {

        let character
        
        try {
            character = await Character.findById(request.params.id)/*.populate('weapons')
            .populate('armor')
            .populate('perks')
            .populate('effects')
            .populate('medicines')
            .populate('inventorys').exec();*/

        } catch (err) {
            return reply.code(400).send({ error: 'Invalid ID: must be a 24-character hex string' })
        }

        if (!character) {
            return character.code(404).send({ error: 'Not found' })
        }

        return reply.code(200).send(character)
    })

    fastify.put('/:id', async (request, reply) => {

        let objectId
        try {
            objectId = new fastify.mongo.ObjectId(request.params.id)
        } catch (err) {
            return reply.code(400).send({ error: 'Invalid ID format' })
        }

        const character = await characters().updateOne({ _id: objectId }, { $set: request.body })

        if (character.matchedCount === 0) {
            return reply.code(404).send({ error: 'Character not found' })
        }

        return reply.code(201).send({ success: true })
    })


    fastify.delete('/:id', async (request, reply) => {
        let objectId

        try {
            objectId = new fastify.mongo.ObjectId(request.params.id)
        } catch (err) {
            return reply.code(400).send({ error: 'Invalid ID: must be a 24-character hex string' })
        }

        const character = await characters().deleteOne({ _id: objectId })

        if (character.deletedCount === 0) {
            return reply.code(404).send({ error: 'Not found' })
        }

        return reply.send({ success: true })
    })

}
