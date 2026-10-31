import Fight from '../schemas/fightSchema.js'
import { toObjectId, preserveSubdocIds } from '../utils/IDConverter.js'
import { applyPatchOps } from '../utils/patchHelper.js'

const SUBDOC_ARRAY_FIELDS = ['tiles', 'enemies', 'participants']

export const getFights = async (request, response) => {
    const fights = await Fight.find({ session: request.auth.sessionId })
    return response.code(200).send(fights)
}

// Lightweight lookup any session member can call to decide whether to show
// an "Open Fight" entry point - the full, role-filtered state is delivered
// over the fight:join websocket event instead.
export const getActiveFight = async (request, response) => {
    const fight = await Fight.findOne({ session: request.auth.sessionId, isActive: true }).select('name')
    return response.code(200).send(fight)
}

export const getFightById = async (request, response) => {
    const objectId = toObjectId(request.params.id, response)

    const fight = await Fight.findById(objectId)
    if (!fight) return response.code(404).send({ error: `Fight with ID ${objectId} not found` })

    if (fight.session.toString() !== request.auth.sessionId) {
        return response.code(403).send({ error: 'Fight does not belong to this session' })
    }

    return response.code(200).send(fight)
}

export const createFight = async (request, response) => {
    const fight_data = request.body

    if (fight_data.session !== request.auth.sessionId) {
        return response.code(403).send({ error: 'Cannot create a fight in another session' })
    }

    const fight = await Fight.create(fight_data)
    if (!fight) return response.code(404).send({ error: 'Can`t create fight' })

    return response.code(201).send(fight)
}

export const updateFight = async (request, response) => {
    const objectId = toObjectId(request.params.id, response)

    const existingFight = await Fight.findById(objectId)
    if (!existingFight) return response.code(404).send({ error: `Fight with ID ${objectId} not found` })

    if (existingFight.session.toString() !== request.auth.sessionId) {
        return response.code(403).send({ error: 'Fight does not belong to this session' })
    }

    const { data: fight_data, error } = applyPatchOps(request.body?.ops)
    if (error) return response.code(400).send({ error })

    for (const field of SUBDOC_ARRAY_FIELDS) {
        if (fight_data[field]) {
            fight_data[field] = preserveSubdocIds(existingFight[field], fight_data[field])
        }
    }

    const fight = await Fight.findByIdAndUpdate(objectId, fight_data, { new: true, runValidators: true })
    if (!fight) return response.code(404).send({ error: `Fight with ID ${objectId} not found` })

    return response.code(200).send(fight)
}

// Exclusive on/off switch - activating one fight deactivates every other
// fight in the same session, so the session always has at most one live fight.
export const activateFight = async (request, response) => {
    const objectId = toObjectId(request.params.id, response)

    const fight = await Fight.findById(objectId)
    if (!fight) return response.code(404).send({ error: `Fight with ID ${objectId} not found` })

    if (fight.session.toString() !== request.auth.sessionId) {
        return response.code(403).send({ error: 'Fight does not belong to this session' })
    }

    await Fight.updateMany({ session: fight.session, _id: { $ne: fight.id } }, { isActive: false })
    fight.isActive = true
    await fight.save()

    return response.code(200).send(fight)
}

export const deactivateFight = async (request, response) => {
    const objectId = toObjectId(request.params.id, response)

    const fight = await Fight.findById(objectId)
    if (!fight) return response.code(404).send({ error: `Fight with ID ${objectId} not found` })

    if (fight.session.toString() !== request.auth.sessionId) {
        return response.code(403).send({ error: 'Fight does not belong to this session' })
    }

    fight.isActive = false
    await fight.save()

    return response.code(200).send(fight)
}

export const deleteFight = async (request, response) => {
    const objectId = toObjectId(request.params.id, response)

    const existingFight = await Fight.findById(objectId)
    if (!existingFight) return response.code(404).send({ error: `Fight with ID ${objectId} not found` })

    if (existingFight.session.toString() !== request.auth.sessionId) {
        return response.code(403).send({ error: 'Fight does not belong to this session' })
    }

    const fight = await Fight.findByIdAndDelete(objectId)

    return response.code(200).send({ status: 'Success', id: fight.id })
}
