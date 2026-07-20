import { createId } from '../../utils/IDConverter.js'
import {
    requiredString,
    optionalString,
    optionalNumber,
    parseJSON,
    parseNameList,
    resolveNames,
    toNameList,
    parseNameIdEntry,
    parseNameIdList,
    resolveNameIdEntries,
    toNameIdArray,
    toNameIdList,
    stringifyMaybe,
} from './helpers.js'

function validateEntityType(value, ctx, errors) {
    const val = String(value ?? '').trim()

    if (!val) {
        errors.push('type is required')
        return val
    }

    const id = ctx.entityTypesByName.get(val)
    if (!id) {
        errors.push(`Unknown entity type: "${val}" (allowed: ${[...ctx.entityTypesByName.keys()].join(', ')})`)
        return val
    }

    return id
}

function validatePerkType(value, ctx, errors) {
    const val = String(value ?? '').trim()

    if (!val) {
        errors.push('type is required')
        return null
    }

    const found = ctx.perkTypesByName.get(val)
    if (!found) {
        errors.push(`Unknown perk type: "${val}" (allowed: ${[...ctx.perkTypesByName.keys()].join(', ')})`)
        return null
    }

    return found
}

export const TYPE_FIELDS = {
    effects: {
        headers: () => ['id', 'name', 'description', 'effect'],
        toRow: (doc) => ({
            id: doc.id,
            name: doc.name,
            description: doc.description,
            effect: stringifyMaybe(doc.effect),
        }),
        fromRow: (row, ctx, errors) => ({
            name: requiredString(row.name, 'name', errors),
            description: requiredString(row.description, 'description', errors),
            effect: parseJSON(row.effect, 'effect', errors, null),
        }),
        template: [
            {
                name: 'Poison',
                description: 'Deals poison damage over time',
                effect: '{"damage": 10, "duration": 3, "type": "poison"}',
            },
        ],
    },

    entities: {
        headers: () => ['id', 'name', 'type', 'description', 'image', 'notes', 'characteristics', 'requirement', 'effects', 'price', 'rarity'],
        toRow: (doc, ctx) => ({
            id: doc.id,
            name: doc.name,
            type: ctx.entityTypeNameById.get(doc.type) ?? doc.type,
            description: doc.description ?? '',
            notes: doc.notes ?? '',
            characteristics: stringifyMaybe(doc.characteristics),
            requirement: stringifyMaybe(doc.requirement),
            effects: toNameList(doc.effects, ctx.effectsById),
            price: doc.price ?? '',
            rarity: doc.rarity ?? '',
        }),
        fromRow: (row, ctx, errors) => ({
            name: requiredString(row.name, 'name', errors),
            type: validateEntityType(row.type, ctx, errors),
            description: optionalString(row.description),
            image: optionalString(row.image),
            notes: optionalString(row.notes),
            characteristics: parseJSON(row.characteristics, 'characteristics', errors, null),
            requirement: parseJSON(row.requirement, 'requirement', errors, null),
            effects: resolveNames(parseNameList(row.effects), ctx.effectsByName, 'effect', errors),
            price: optionalNumber(row.price, 'price', errors, null),
            rarity: optionalString(row.rarity),
        }),
        template: [
            {
                name: 'Iron Sword',
                description: 'A sturdy blade favored by new adventurers',
                type: 'Weapon',
                notes: 'Starter weapon',
                characteristics: '{"strength": 5, "durability": 20}',
                requirement: '{"level": 1}',
                effects: 'Poison effect (should exist)',
                price: 100,
                rarity: 'Common',
            },
        ],
    },

    perks: {
        headers: () => ['id', 'name', 'description', 'type', 'levels', 'requirement', 'ranks', 'notes'],
        toRow: (doc) => ({
            id: doc.id,
            name: doc.name,
            description: doc.description,
            type: doc.type?.name ?? '',
            levels: doc.levels?.length ? JSON.stringify(doc.levels) : '',
            requirement: stringifyMaybe(doc.requirement),
            ranks: doc.ranks ?? 0,
            notes: doc.notes ?? '',
        }),
        fromRow: (row, ctx, errors) => ({
            name: requiredString(row.name, 'name', errors),
            description: optionalString(row.description),
            type: validatePerkType(row.type, ctx, errors),
            levels: parseJSON(row.levels, 'levels', errors, []),
            requirement: parseJSON(row.requirement, 'requirement', errors, null),
            ranks: optionalNumber(row.ranks, 'ranks', errors, 0),
            notes: optionalString(row.notes),
        }),
        template: [
            {
                name: 'Quick Reflexes',
                description: 'Increases reaction speed in combat',
                levels: '[{"name":"Desc for level1"},{"bonus":"Desc for level2"}]',
                requirement: '{"level": 3}',
                ranks: 2,
                notes: 'Stacks with agility-based perks',
            },
        ],
    },

    characters: {
        headers: (ctx) => [
            'id', 'name', 'image', 'gender', 'class', 'race',
            'level', 'experience', 'experienceToLevelUp', 'perkPoints',
            'adminNotes', 'playerNotes',
            ...ctx.characteristicsList.map(name => `Char: ${name}`),
            ...ctx.currencyTypes.map(name => `Currency: ${name}`),
            'customFields', 'health', 'effects', 'perks', 'entities', 'loadouts', 'loadoutsLimit',
        ],
        toRow: (doc, ctx) => {
            const row = {
                id: doc.id,
                name: doc.name,
                image: doc.image ?? '',
                gender: doc.gender ?? '',
                class: doc.class ?? '',
                race: doc.race ?? '',
                level: doc.level ?? 0,
                experience: doc.experience ?? 0,
                experienceToLevelUp: doc.experienceToLevelUp ?? 10,
                perkPoints: doc.perkPoints ?? 0,
                adminNotes: doc.adminNotes ?? '',
                playerNotes: doc.playerNotes ?? '',
            }

            for (const name of ctx.characteristicsList) {
                const entry = (doc.characteristics ?? []).find(c => c.name === name)
                row[`Char: ${name}`] = entry?.value ?? 0
            }

            for (const name of ctx.currencyTypes) {
                const entry = (doc.currency ?? []).find(c => c.name === name)
                row[`Currency: ${name}`] = entry?.value ?? 0
            }

            row.customFields = doc.customFields?.length
                ? JSON.stringify(doc.customFields.map(({ name, description, value }) => ({ name, description, value })))
                : ''
            row.health = doc.health?.length ? JSON.stringify(doc.health) : ''
            row.effects = toNameIdList(doc.effects, ctx.effectsById)
            row.perks = toNameIdList(doc.perks, ctx.perksById)
            row.entities = toNameIdList(doc.entities, ctx.entitiesById)
            // row.loadouts = doc.loadouts?.length
            //     ? JSON.stringify(doc.loadouts.map(l => ({
            //         name: l.name,
            //         items: toNameIdArray(l.itemsIds, ctx.entitiesById),
            //         perks: toNameIdArray(l.perksIds, ctx.perksById),
            //     })))
            //     : ''
            // row.loadoutsLimit = stringifyMaybe(doc.loadoutsLimit)

            return row
        },
        fromRow: (row, ctx, errors) => ({
            name: requiredString(row.name, 'name', errors),
            image: optionalString(row.image),
            gender: optionalString(row.gender),
            class: optionalString(row.class),
            race: optionalString(row.race),
            level: optionalNumber(row.level, 'level', errors, 0),
            experience: optionalNumber(row.experience, 'experience', errors, 0),
            experienceToLevelUp: optionalNumber(row.experienceToLevelUp, 'experienceToLevelUp', errors, 10),
            perkPoints: optionalNumber(row.perkPoints, 'perkPoints', errors, 0),
            adminNotes: optionalString(row.adminNotes),
            playerNotes: optionalString(row.playerNotes),
            characteristics: ctx.characteristicsList.map(name => ({
                name,
                value: optionalNumber(row[`Char: ${name}`], `Char: ${name}`, errors, 0),
                id: createId().toString(),
            })),
            currency: ctx.currencyTypes.map(name => {
                const typeDef = ctx.currencyTypesByName.get(name)
                return {
                    name,
                    value: optionalNumber(row[`Currency: ${name}`], `Currency: ${name}`, errors, 0),
                    icon: typeDef?.icon ?? 'currencyDollar',
                    id: createId().toString(),
                }
            }),
            customFields: parseJSON(row.customFields, 'customFields', errors, []),
            health: parseJSON(row.health, 'health', errors, []),
            effects: resolveNameIdEntries(parseNameIdList(row.effects), ctx.effectsById, ctx.effectsByName, 'effect', errors),
            perks: resolveNameIdEntries(parseNameIdList(row.perks), ctx.perksById, ctx.perksByName, 'perk', errors),
            entities: resolveNameIdEntries(parseNameIdList(row.entities), ctx.entitiesById, ctx.entitiesByName, 'entity', errors),
            // loadouts: parseJSON(row.loadouts, 'loadouts', errors, []).map((l, i) => ({
            //     name: requiredString(l.name, `loadouts[${i}].name`, errors),
            //     itemsIds: resolveNameIdEntries((l.items ?? []).map(parseNameIdEntry), ctx.entitiesById, ctx.entitiesByName, `loadouts[${i}].items`, errors),
            //     perksIds: resolveNameIdEntries((l.perks ?? []).map(parseNameIdEntry), ctx.perksById, ctx.perksByName, `loadouts[${i}].perks`, errors),
            // })),
            // loadoutsLimit: parseJSON(row.loadoutsLimit, 'loadoutsLimit', errors, {}),
        }),
        template: [
            {
                name: 'Aria Stormwind',
                image: '',
                gender: 'Female',
                class: 'Ranger',
                race: 'Elf',
                level: 1,
                experience: 0,
                experienceToLevelUp: 10,
                perkPoints: 0,
                adminNotes: 'Created from the import template',
                playerNotes: '',
                customFields: '[{"name":"Backstory","description":"Character history","value":"Grew up in the northern forests"}]',
                health: '[{"name":"HP","min":0,"max":10,"value":10}]',
                effects: 'Fireball, Frost Shield',
                perks: 'Quick Reflexes',
                entities: 'Iron Sword',
                // loadouts: '[{"name":"Main Loadout","items":["Iron Sword"],"perks":["Quick Reflexes"]}]',
                // loadoutsLimit: '{"loadouts": 2, "items": 10, "perks": 5}',
            },
        ],
    },
}
