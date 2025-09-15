import Effect from '../schemas/effectSchema.js'

export async function populateEffects(effects) {
    return Promise.all(
        effects.map(async (effect) => {
            if (effect?.effect) {
                effect.effect = await Effect.findById(effect.effect)
            }
            return effect
        })
    )
}