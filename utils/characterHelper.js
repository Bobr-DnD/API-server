import { createId } from './IDConverter.js'
import mongoose from 'mongoose';
import Character from '../schemas/characterSchema.js'

export function addId(field) {
    if (field.id && mongoose.isValidObjectId(field.id)) return
    field.id = createId().toString()
}

export function generateId() {
    return createId().toString()
}

export function toSessionCharacteristics(characterField, sessionField) {

    const newStats = sessionField.reduce((stats, el) => {
        stats[el.name] = characterField?.[el.name] ?? 0;
        return stats;
    }, {});

    return newStats;
}

export function toSessionCurrency(characterField, sessionField) {

    return sessionField.map((el) => ({
        name: el.name,
        value: characterField.find(item => item.name === el.name)?.value ?? 0,
        icon: el.icon,
        id: generateId()
    }));
}

export async function updateCharacterSessionCharacteristic(characters, sessionStats) {

    for (const character of characters) {

        character.characteristics = toSessionCharacteristics(
            character.characteristics,
            sessionStats
        );

        await Character.findByIdAndUpdate(
            character.id,
            { characteristics: character.characteristics },
            { new: true, runValidators: true }
        );
    }

}

export async function updateCharacterSessionCurrency(characters, sessionStats) {

    for (const character of characters) {

        character.currency = toSessionCurrency(
            character.currency,
            sessionStats
        );

        await Character.findByIdAndUpdate(
            character.id,
            { currency: character.currency },
            { new: true, runValidators: true }
        );
    }

}
