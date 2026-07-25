import Effect from '../../schemas/effectSchema.js'
import Perk from '../../schemas/perkSchema.js'
import Entity from '../../schemas/entitySchema.js'

export async function buildContext(session) {
    const [effects, perks, entities] = await Promise.all([
        Effect.find({ _id: { $in: session.effects } }).select('name'),
        Perk.find({ _id: { $in: session.perks } }).select('name'),
        Entity.find({ _id: { $in: session.entities } }).select('name'),
    ])

    return {
        effectsByName: new Map(effects.map(e => [e.name, e.id])),
        perksByName: new Map(perks.map(p => [p.name, p.id])),
        entitiesByName: new Map(entities.map(e => [e.name, e.id])),

        effectsById: new Map(effects.map(e => [e.id, e.name])),
        perksById: new Map(perks.map(p => [p.id, p.name])),
        entitiesById: new Map(entities.map(e => [e.id, e.name])),

        entityTypesByName: new Map(session.entityTypes.map(t => [t.name, t.id])),
        entityTypeNameById: new Map(session.entityTypes.map(t => [t.id, t.name])),
        perkTypesByName: new Map(session.perkTypes.map(t => [t.name, { name: t.name, color: t.color, _id: t.id }])),
        currencyTypesByName: new Map(session.currencyTypes.map(c => [c.name, { name: c.name, icon: c.icon }])),

        characteristicsList: session.characteristicsList.map(c => c.name),
        currencyTypes: session.currencyTypes.map(c => c.name),
    }
}
