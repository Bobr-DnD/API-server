export function toObjectId(id, reply) {
    try {
        return new reply.server.mongo.ObjectId(id)
    } catch {
        reply.code(400).send({ error: 'Invalid ID format' })
        return null
    }
}