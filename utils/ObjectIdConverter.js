export function toObjectId(id, response) {
    try {
        return new response.server.mongo.ObjectId(id)
    } catch {
        response.code(400).send({ error: 'Invalid ID: must be a 24-character hex string' })
        return null
    }
}