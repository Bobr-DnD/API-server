import { transformArray, transformId } from '../utils/IDConverter.js'
import {toObjectId} from '../utils/ObjectIdConverter.js'

export function commonRoutes(fastify, { path, model, collection, skipMethods = [] }) {

    if (!skipMethods.includes('getAll')) {
        fastify.get(path, async (request, reply) => {
            const object = await collection().find().toArray()
            return reply.code(200).send(transformArray(object))
        })
    }

    if (!skipMethods.includes('post')) {
        fastify.post(path, async (request, reply) => {
            const object = await model.create(request.body)
            return reply.code(201).send(object)
        })
    }

    if (!skipMethods.includes('getById')) {
        fastify.get(`${path}:id`, async (request, reply) => {
            const objectId = toObjectId(request.params.id, reply)
            if (!objectId) return reply.code(400).send({ error: 'Invalid ID: must be a 24-character hex string' })

            const object = await collection().findOne({ _id: objectId })
            if (!object) return reply.code(404).send({ error: `${model} not found` })

            return reply.code(200).send(transformId(object))
        })
    }

    if (!skipMethods.includes('patch')) {
        fastify.patch(`${path}:id`, async (request, reply) => {
            const objectId = toObjectId(request.params.id, reply)
            if (!objectId) return reply.code(400).send({ error: 'Invalid ID: must be a 24-character hex string' })

            const object = await model.findByIdAndUpdate(objectId, request.body, { new: true, runValidators: true })
            if (!object) return reply.code(404).send({ error: `${model} not found` })

            return reply.code(200).send(object)
        })
    }

    if (!skipMethods.includes('delete')) {
        fastify.delete(`${path}:id`, async (request, reply) => {
            const objectId = toObjectId(request.params.id, reply)
            if (!objectId) returnreply.code(400).send({ error: 'Invalid ID: must be a 24-character hex string' })

            const result = await collection().deleteOne({ _id: objectId })
            if (result.deletedCount === 0) return reply.code(404).send({ error: `${entity} not found` })

            return reply.send({ success: true })
        })
    }
}