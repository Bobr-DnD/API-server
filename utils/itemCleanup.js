import Session from '../schemas/sessionSchema.js'
import Character from '../schemas/characterSchema.js'
import Entity from '../schemas/entitySchema.js'

const LOADOUT_FIELDS = {
    entities: 'itemsIds',
    perks: 'perksIds'
}

export async function clearDeletedReferences(id, field) {
    await Session.updateMany(
        { [field]: id },
        { $pull: { [field]: id } }
    )

    const loadoutField = LOADOUT_FIELDS[field]
    const pull = { [field]: id }
    const or = [{ [field]: id }]

    if (loadoutField) {
        pull[`loadouts.$[].${loadoutField}`] = id
        or.push({ [`loadouts.${loadoutField}`]: id })
    }

    await Character.updateMany({ $or: or }, { $pull: pull })
}

export async function clearDeletedEffectFromEntities(effectId) {
    await Entity.updateMany(
        { effects: effectId },
        { $pull: { effects: effectId } }
    )
}
