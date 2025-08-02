import Medicine from '../schemas/medicinesSchema.js'
import {commonRoutes} from '../plugins/commonController.js'

export default async function medicineRoute(fastify, opts) {
    const medicines = () => fastify.mongo.db.collection('medicines')

    commonRoutes(fastify, {path:'/', model:Medicine, collection:medicines, skipMethods:['getById']})

    fastify.get('/:id', async (request, reply) => {
        let objectId
        try {
            objectId = new fastify.mongo.ObjectId(request.params.id)
        } catch (err) {
            return reply.code(400).send({ error: 'Invalid ID: must be a 24-character hex string' })
        }

        const medicine = await Medicine.findOne(objectId).populate('effect').populate('addictionEffect').populate('recipe').exec()
        if (!medicine) {
            return reply.code(404).send({ error: 'Medicine not found' })
        }

        return reply.code(200).send(medicine)
    })

}