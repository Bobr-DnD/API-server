import Session from '../schemas/sessionSchema.js'
import { toObjectId } from '../utils/ObjectIdConverter.js'
import { populateSession } from '../utils/entityPopulator.js';


export const getSessions = async (request, response) => {
    const sessions = await Session.find();
    return response.code(200).send(sessions)
}

export const getSessionById = async (request, response) => {
    
    const objectId = toObjectId(request.params.id, response)

    const session = await populateSession(
        Session.findById(objectId)
    ).exec();

    if (!session) {
        return response.code(404).send({ error: `Session with ID ${objectId} not found` })
    }

    return response.code(200).send(session)
}

export const createSession = async (request, response) => {
    const session = await Session.create(request.body)
    if (!session) {
        return response.code(404).send({ error: 'Can`t create session' })
    }
    return response.code(201).send(session)
}

export const updateSession = async (request, response) => {
    const objectId = toObjectId(request.params.id, response)

    const session = await populateSession(
        Session.findByIdAndUpdate(objectId, request.body, {new: true, runValidators: true})
    ).exec();

    if (!session) {
        return response.code(404).send({ error: `Character with ID ${objectId} not found` })
    }

    return response.code(200).send(session)
}

export const deleteSession = async (request, response) => {
    const objectId = toObjectId(request.params.id, response)

    const session = await Session.findByIdAndDelete(objectId)
    if (!session) {
        return response.code(404).send({ error: `Session with ID ${objectId} not found` })
    }

    return response.code(200).send({ status: 'Success' })
}