import { transformArray, transformId } from '../utils/IDConverter.js'
import { toObjectId } from '../utils/IDConverter.js'
import { addItem } from './sessionController.js'
import { addId } from '../utils/characterHelper.js'
import { clearDeletedReferences, clearDeletedEffectFromEntities } from '../utils/itemCleanup.js'

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

export const createEntity = (model, field) => async (request, response) => {
    
    if (request.body.steps) request.body.steps.forEach(step => addId(step))

    const object = await model.create(request.body)

    await addItem({ sessionId: request.body.session, id: object.id, field }, response)
    return response.code(201).send(object)
}

export const updateEntity = (model) => async (request, response) => {
    const objectId = toObjectId(request.params.id, response)

    if (request.body.steps) request.body.steps.forEach(step => addId(step))

    const object = await model.findByIdAndUpdate(objectId, request.body, { new: true, runValidators: true })
    if (!object) return response.code(404).send({ error: `${model} not found` })

    return response.code(200).send(object)
}

export const deleteEntity = (collection, collectionName) => async (request, response) => {
    const objectId = toObjectId(request.params.id, response)

    const result = await collection().deleteOne({ _id: objectId })
    if (result.deletedCount === 0) return response.code(404).send({ error: `${entity} not found` })

    if (collectionName === 'entities' || collectionName === 'perks' || collectionName === 'effects') {
        await clearDeletedReferences(request.params.id, collectionName)
    }

    if (collectionName === 'effects') await clearDeletedEffectFromEntities(request.params.id)

    return response.code(201).send({ success: true })
}