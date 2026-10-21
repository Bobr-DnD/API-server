import WsLog from '../schemas/wsLogSchema.js'
import Character from '../schemas/characterSchema.js'
import Session from '../schemas/sessionSchema.js'
import { transformId } from '../utils/IDConverter.js'

export const getLogs = async (request, response) => {
    const { page = 1, limit = 50, sessionId, characterName, event } = request.query

    const filter = {}
    if (sessionId) filter.sessionId = sessionId
    if (event) filter.event = event

    if (characterName) {
        const matchingCharacters = await Character.find({ name: { $regex: characterName, $options: 'i' } })
            .select('_id')
            .lean()

        filter.characterId = { $in: matchingCharacters.map(c => c._id.toString()) }
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1)
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10) || 50))

    const [logs, total] = await Promise.all([
        WsLog.find(filter)
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .lean(),
        WsLog.countDocuments(filter)
    ])

    const sessionIds = [...new Set(logs.map(log => log.sessionId).filter(Boolean))]
    const characterIds = [...new Set(logs.map(log => log.characterId).filter(Boolean))]

    const [sessions, characters] = await Promise.all([
        sessionIds.length ? Session.find({ _id: { $in: sessionIds } }).select('name').lean() : [],
        characterIds.length ? Character.find({ _id: { $in: characterIds } }).select('name').lean() : []
    ])

    const sessionNameById = new Map(sessions.map(s => [s._id.toString(), s.name]))
    const characterNameById = new Map(characters.map(c => [c._id.toString(), c.name]))

    const enrichedLogs = logs.map(log => ({
        ...transformId(log),
        sessionName: log.sessionId ? sessionNameById.get(log.sessionId) ?? null : null,
        characterName: log.characterId ? characterNameById.get(log.characterId) ?? null : null
    }))

    return response.code(200).send({
        logs: enrichedLogs,
        total,
        page: pageNum,
        limit: limitNum
    })
}
