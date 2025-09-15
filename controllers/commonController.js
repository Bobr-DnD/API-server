import { transformArray, transformId } from '../utils/IDConverter.js'
import { toObjectId } from '../utils/ObjectIdConverter.js'

export const getEntities = (collection) => async (request, response) => {
    const object = await collection().find().toArray()
    return response.code(200).send(transformArray(object))
}

export const getEntityById = (collection) => async (request, response) => {
    const objectId = toObjectId(request.params.id, response)

    const object = await collection().findOne({ _id: objectId })
    if (!object) return response.code(404).send({ error: `${model} not found` })

    return response.code(200).send(transformId(object))
}

export const createEntity = (model) => async (request, response) => {
    const object = await model.create(request.body)
    return response.code(201).send(object)
}

export const updateEntity = (model) => async (request, response) => {
    const objectId = toObjectId(request.params.id, response)

    const object = await model.findByIdAndUpdate(objectId, request.body, { new: true, runValidators: true })
    if (!object) return response.code(404).send({ error: `${model} not found` })

    return response.code(200).send(object)
}

export const deleteEntity = (collection) => async (request, response) => {
    const objectId = toObjectId(request.params.id, response)

    const result = await collection().deleteOne({ _id: objectId })
    if (result.deletedCount === 0) return response.code(404).send({ error: `${entity} not found` })

    return response.send({ success: true })
}