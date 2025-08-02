import Medicine from '../schemas/medicinesSchema.js'

export default async function medicineRoute(fastify, opts) {
    const medicines = () => fastify.mongo.db.collection('medicines')

    fastify.get('/', async (request, reply) => {
        const allMedicines = await medicines().find().toArray()
        return reply.code(200).send(allMedicines)
    })

    fastify.post('/', async (request, reply) => {
        const medicine = await Medicine.create(request.body)
        return reply.code(201).send(medicine)
    })

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

    fastify.patch('/:id', async (request, reply) => {
        let objectId
        try {
            objectId = new fastify.mongo.ObjectId(request.params.id)
        } catch (err) {
            return reply.code(400).send({ error: 'Invalid ID format' })
        }

        const updatedMedicine = await Medicine.findByIdAndUpdate(objectId, request.body, {new: true, runValidators: true})

        if (!updatedMedicine) {
            return reply.code(404).send({ error: 'Medicine not found' })
        }

        return reply.code(200).send(updatedMedicine)
    })

    fastify.delete('/:id', async (request, reply) => {
        let objectId
        try {
            objectId = new fastify.mongo.ObjectId(request.params.id)
        } catch (err) {
            return reply.code(400).send({ error: 'Invalid ID format' })
        }

        const result = await medicines().deleteOne({ _id: objectId })

        if (result.deletedCount === 0) {
            return reply.code(404).send({ error: 'Medicine not found' })
        }

        return reply.send({ success: true })
    })
}
