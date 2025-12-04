import { createId } from './IDConverter.js'

export function populateEffects(effects = [], effectsDuration = []) {
    if (!Array.isArray(effects) || effects.length === 0) {
        console.log('bad');

        return []
    }

    effects.forEach((effect, index) => {
        effect.timeLeft = effectsDuration[index]
    })
    
}

export async function addHealthId(field) {
    if (field.id) return
    field.id = createId().toString()
}