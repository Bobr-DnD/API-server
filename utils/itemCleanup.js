import Session from '../schemas/sessionSchema.js'
import Character from '../schemas/characterSchema.js'
import Entity from '../schemas/entitySchema.js'
import Fight from '../schemas/fightSchema.js'

const LOADOUT_FIELDS = {
    entities: 'itemsIds',
    perks: 'perksIds'
}

// field is the Session/Character field name ('entities' or 'perks') the
// deleted id used to live in - also doubles as the Fight.enemies subfield
// name, since enemies carry the same 'entities'/'perks' ref arrays.
const FIGHT_ENEMY_FIELDS = ['entities', 'perks']

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

    if (FIGHT_ENEMY_FIELDS.includes(field)) {
        await Fight.updateMany(
            { [`enemies.${field}`]: id },
            { $pull: { [`enemies.$[].${field}`]: id } }
        )
    }

    if (field === 'entities') {
        await Fight.updateMany(
            { 'participants.activeWeapon': id },
            { $set: { 'participants.$[p].activeWeapon': null } },
            { arrayFilters: [{ 'p.activeWeapon': id }] }
        )
    }
}

export async function clearDeletedEffectFromEntities(effectId) {
    await Entity.updateMany(
        { effects: effectId },
        { $pull: { effects: effectId } }
    )
}

// Called when a Character is deleted - a dangling participant entry would
// otherwise keep referencing a Character document that no longer exists.
export async function clearDeletedCharacterFromFights(characterId) {
    await Fight.updateMany(
        { 'participants.character': characterId },
        { $pull: { participants: { character: characterId } } }
    )
}
