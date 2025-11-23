import Effect from '../schemas/effectSchema.js'
import { createId } from './IDConverter.js'

export async function populateEffects(effects = []) {
    if (!Array.isArray(effects) || effects.length === 0) {
        return []
    }

    return Promise.all(
        effects.map(async (e) => {
            try {
                if (!e || !e.id) return e

                const found = await Effect.findById(e.id)
                return { ...e, effect: found }

            } catch (err) {
                console.warn(`Failed to populate effect ${e.id}:`, err.message)
                return e
            }
        })
    )
}

export async function addHealthId(field) {
    if (field.id) return
    field.id = createId().toString()
}