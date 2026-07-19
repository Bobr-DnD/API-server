import Session from '../../schemas/sessionSchema.js'
import Effect from '../../schemas/effectSchema.js'
import Perk from '../../schemas/perkSchema.js'
import Entity from '../../schemas/entitySchema.js'
import Character from '../../schemas/characterSchema.js'
import { buildContext } from './context.js'
import { TYPE_FIELDS } from './fields.js'
import { parseSpreadsheet, buildSpreadsheet, detectFormat } from './spreadsheet.js'

const TYPE_MODELS = {
    entities: Entity,
    effects: Effect,
    perks: Perk,
    characters: Character,
}

const CONTENT_TYPES = {
    csv: 'text/csv; charset=utf-8',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

export default async function importExportPlugin(fastify) {

    fastify.get('/:sessionId/:type/export', async (request, reply) => {
        const { sessionId, type } = request.params
        const model = TYPE_MODELS[type]
        const fields = TYPE_FIELDS[type]

        if (!model || !fields) {
            return reply.code(400).send({ error: `Unknown type: ${type}` })
        }

        const session = await Session.findById(sessionId)
        if (!session) {
            return reply.code(404).send({ error: `Session with ID ${sessionId} not found` })
        }

        const format = detectFormat(null, request.query.format)
        const ctx = await buildContext(session)
        const docs = await model.find({ _id: { $in: session[type] } })

        const headers = fields.headers(ctx)
        const rows = docs.map(doc => fields.toRow(doc, ctx))
        const buffer = buildSpreadsheet(rows, headers, format)

        return reply
            .header('Content-Disposition', `attachment; filename="${type}.${format}"`)
            .header('Content-Type', CONTENT_TYPES[format])
            .send(buffer)
    })

    fastify.post('/:sessionId/:type/import', async (request, reply) => {
        const { sessionId, type } = request.params
        const model = TYPE_MODELS[type]
        const fields = TYPE_FIELDS[type]

        if (!model || !fields) {
            return reply.code(400).send({ error: `Unknown type: ${type}` })
        }

        const session = await Session.findById(sessionId)
        if (!session) {
            return reply.code(404).send({ error: `Session with ID ${sessionId} not found` })
        }

        const file = await request.file().catch(() => null)
        if (!file) {
            return reply.code(400).send({ error: 'No file uploaded' })
        }

        const buffer = await file.toBuffer()
        const rows = parseSpreadsheet(buffer)

        if (rows.length === 0) {
            return reply.code(400).send({ error: 'File has no data rows' })
        }

        const ctx = await buildContext(session)
        const existingIds = new Set(session[type].map(String))

        const parsed = rows.map((row, index) => {
            const errors = []
            const id = String(row.id ?? '').trim() || null

            if (id && !existingIds.has(id)) {
                errors.push(`id "${id}" does not belong to this session`)
            }

            const payload = fields.fromRow(row, ctx, errors)
            return { index, id, payload, errors }
        })

        const invalidRows = parsed.filter(r => r.errors.length > 0)
        if (invalidRows.length > 0) {
            return reply.code(400).send({
                error: 'Validation failed',
                details: invalidRows.map(r => ({ row: r.index + 2, errors: r.errors })),
            })
        }

        let created = 0
        let updated = 0
        const newIds = []

        for (const row of parsed) {
            if (row.id) {
                await model.findByIdAndUpdate(row.id, row.payload, { new: true, runValidators: true })
                updated++
                continue
            }

            if (type === 'characters') row.payload.session = sessionId

            const doc = await model.create(row.payload)
            newIds.push(doc.id)
            created++
        }

        if (newIds.length > 0) {
            await Session.findByIdAndUpdate(sessionId, { $push: { [type]: { $each: newIds } } })
        }

        return reply.code(200).send({ success: true, created, updated, total: parsed.length })
    })
}
