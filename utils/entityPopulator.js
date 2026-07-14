
export function populateCharacter(query) {
    return query.populate([
        'perks',
        'effects',
        'entities',
        { path: 'entities', populate: ['effects'] }
    ]);
}

export function populateSessionCharacters(query){
    return query.populate([
        {
            path: 'characters',
            select: 'name image level experience experienceToLevelUp health'
        }
    ])
}

export function populateSessionEntitiesAndPerks(query){
    return query.populate([
        'entities',
        'perks',
        { path: 'entities', populate: ['effects'] },
    ])
}

export function populateSession(query) {
    return query.populate([
        'characters',
        'entities',
        'perks',
        'effects',
        'perks',
        { path: 'characters', populate: ['entities', 'perks', 'effects', { path: 'entities', populate: ['effects'] }] },
        { path: 'entities', populate: ['effects'] },
    ])
}

export function populateEntity(query) {
    return query.populate([
        'effects'
    ])
}