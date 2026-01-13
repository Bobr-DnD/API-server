import Session from '../schemas/sessionSchema.js'
import { toObjectId } from '../utils/IDConverter.js'
import { populateSession } from '../utils/entityPopulator.js';
import { transformArray } from '../utils/IDConverter.js'
import { sortByTwoFields } from '../utils/filtration.js';
import { addId, updateCharacterSessionCharacteristic, updateCharacterSessionCurrency } from '../utils/characterHelper.js';

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

    SortAndTransform(session)

    return response.code(200).send(session)
}

export const createSession = async (request, response) => {

    const session_data = request.body

    const properties = ['entityTypes', 'enemyTypes', 'characteristicsList', 'currencyTypes', 'questTypes', 'perkTypes'];
    properties.forEach(prop => {
        session_data[prop]?.forEach(addId);
    });

    const session = await Session.create(session_data)
    if (!session) {
        return response.code(404).send({ error: 'Can`t create session' })
    }
    return response.code(201).send(session)
}

export const updateSession = async (request, response) => {

    const objectId = toObjectId(request.params.id, response)
    const session_data = request.body

    const properties = ['entityTypes', 'enemyTypes', 'characteristicsList', 'currencyTypes', 'questTypes', 'perkTypes'];
    properties.forEach(prop => {
        session_data[prop]?.forEach(addId);
    });

    const session = await populateSession(
        Session.findByIdAndUpdate(objectId, session_data, { new: true, runValidators: true })
    ).exec();

    if (!session) {
        return response.code(404).send({ error: `Sesdion with ID ${objectId} not found` })
    }

    if (session.characters.length > 0) {
        await updateCharacterSessionCharacteristic(session.characters, session.characteristicsList)
        await updateCharacterSessionCurrency(session.characters, session.currencyTypes)
    }

    SortAndTransform(session)

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

export const addItem = async (opts, response) => {
    let session = await Session.findById(opts.sessionId)

    if (!session) {
        return response.code(404).send({ error: `Session with ID ${opts.sessionId} not found` })
    }

    session[opts.field].push(opts.id)
    session = await Session.findByIdAndUpdate(opts.sessionId, session, { new: true, runValidators: true })

}

export const removeItem = async (opts) => {
    let session = await Session.findById(opts.sessionId)

    if (!session) {
        return response.code(404).send({ error: `Session with ID ${opts.sessionId} not found` })
    }

    const index = session[opts.field].findIndex(entity => String(entity) === opts.id)
    if (index !== -1) session[opts.field].splice(index, 1)
    session = await Session.findByIdAndUpdate(opts.sessionId, session, { new: true, runValidators: true })
}

function SortAndTransform(session) {
    transformArray(session.characters)

    sortByTwoFields(session.entities, 'type', 'name')
    sortByTwoFields(session.perks, 'type', 'name')

    session.characters.map(ch => {
        sortByTwoFields(ch.perks, 'type', 'name')
        sortByTwoFields(ch.entities, 'type', 'name')
    })
}