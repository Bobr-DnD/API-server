import Medicine from '../schemas/medicinesSchema.js'
import Enemy from '../schemas/enemySchema.js'

export function populateCharacter(query) {
    return query.populate([
        'weapons',
        'armor',
        'perks',
        'effects',
        'medicines',
        'inventory',
        'quest',
        'medicines.effect',
        'medicines.addictionEffect',
        'medicines.recipe'
    ]);
}

export function populateSession(query) {
    return query.populate([
        'characters',
        'weapons',
        'armors',
        'enemies',
        'perks',
        'effects',
        'medicines',
        'inventories',
        'perks',
        'fractions',
        'quests',
    ])
}

export function populateEnemy(query) {
    return query.populate([
        'weapons',
        'armor'
    ])
}

export function populateMedicine(query){
    return query.populate([
        'effect',
        'addictionEffect',
        'recipe'
    ])
}