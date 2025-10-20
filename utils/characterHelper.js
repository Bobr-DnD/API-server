import Effect from '../schemas/effectSchema.js'

export async function populateEffects(effects = []) {
    if (!Array.isArray(effects) || effects.length === 0) {
        return []
    }

    return Promise.all(
        effects.map(async (e) => {
            try {
                if (!e || !e.effect) return e

                const found = await Effect.findById(e.effect)
                return { ...e, effect: found || e.effect }

            } catch (err) {
                console.warn(`Failed to populate effect ${e.effect}:`, err.message)
                return e
            }
        })
    )
}