
export function populateCharacter(query) {
    return query.populate([
        'perks',
        'effects',
        'entities',
        'quests',
        { path: 'entities', populate: ['effects'] }
    ]);
}

export function populateSession(query) {
    return query.populate([
        'characters',
        'entities',
        'enemies',
        'perks',
        'effects',
        'perks',
        'quests',
        { path: 'characters', populate: ['entities', 'perks', 'quests', 'effects', { path: 'entities', populate: ['effects'] }] },
        { path: 'entities', populate: ['effects'] },
    ])
}

export function populateEnemy(query) {
    return query.populate([
        'entities'
    ])
}

export function populateEntity(query) {
    return query.populate([
        'effects'
    ])
}