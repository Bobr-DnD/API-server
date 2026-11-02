import fp from 'fastify-plugin'
import jwt from 'jsonwebtoken'

export default fp(async (fastify) => {
    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new Error('JWT_SECRET must be set')
    }
    const expiresIn = process.env.JWT_EXPIRES_IN || '12h'

    fastify.decorate('signSessionToken', ({ sessionId, role }) => {
        return jwt.sign({ sessionId, role }, secret, { expiresIn })
    })

    fastify.decorate('authenticate', async (request, reply) => {
        const header = request.headers.authorization
        const token = header?.startsWith('Bearer ') ? header.slice(7) : null

        if (!token) {
            return reply.code(401).send({ error: 'Missing bearer token' })
        }

        try {
            request.auth = jwt.verify(token, secret)
        } catch {
            return reply.code(401).send({ error: 'Invalid or expired token' })
        }
    })

    fastify.decorate('requireAdmin', async (request, reply) => {
        await fastify.authenticate(request, reply)
        if (reply.sent) return

        if (request.auth.role !== 'admin') {
            return reply.code(403).send({ error: 'Admin access required' })
        }
    })

    fastify.decorate('requireSessionParam', (paramName = 'id') => {
        return async (request, reply) => {
            if (request.auth.sessionId !== request.params[paramName]) {
                return reply.code(403).send({ error: 'Token does not match this session' })
            }
        }
    })
})
