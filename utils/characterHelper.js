import Effect from '../schemas/effectSchema.js'
import Medicine from '../schemas/medicinesSchema.js'


export async function populateEffects(effects) {
    return Promise.all(
        effects.map(async (e) => {
            if (e.effect) {
                e.effect = await Effect.findById(e.effect)
            }
            return e
        })
    )
}

export async function populateMedicines(medicines) {
    return Promise.all(
        medicines.map(async (m) => {
            if (m?.effect) {
                m.effect = await Effect.findById(m.effect)
            }
            console.log(m.effect);
            
            
            return m
        })
    )
}