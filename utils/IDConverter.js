import mongoose from "mongoose"

export function transformId(doc) {
    if (!doc) return doc
    const { _id, ...rest } = doc

    return { id: _id.toString(), ...rest }
}

export function transformArray(docs) {
    return docs.map(transformId)
}

export function createId() {
    return new mongoose.Types.ObjectId()
}

export function toObjectId(id, response) {
    try {
        return new response.server.mongo.ObjectId(id)
    } catch {
        response.code(400).send({ error: `Invalid ID: must be a 24-character hex string, but id is: ${id}` })
        return null
    }
}

export function preserveSubdocIds(existingArray = [], incomingArray) {
    if (!Array.isArray(incomingArray)) return incomingArray

    const existingById = new Map(existingArray.map(item => [item.id, item]))

    return incomingArray.map(item => {
        const matchId = item?._id ?? item?.id
        const existing = matchId && existingById.get(String(matchId))
        if (!existing) return item

        const { id, ...rest } = item
        return { ...rest, _id: existing._id }
    })
}