
export function populateCharacter(query) {
    return query.populate([
        'perks',
        'effects',
        'entities',
        'quests',
        {path: 'entities', populate: ['effects']}
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
        'fractions',
        'quests',
        {path: 'characters', populate: ['entities', 'perks', 'quests', 'effects']},
        {path: 'enemies', populate: ['entities']}
    ])
}

export function populateEnemy(query) {
    return query.populate([
        'entities'
    ])
}