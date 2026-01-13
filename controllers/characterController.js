import Character from '../schemas/characterSchema.js'
import Session from '../schemas/sessionSchema.js'
import { addItem, removeItem } from './sessionController.js'
import { toObjectId } from '../utils/IDConverter.js'
import { addId, toSessionCharacteristics, toSessionCurrency } from '../utils/characterHelper.js'
import { populateCharacter } from '../utils/entityPopulator.js'
import { sortByTwoFields } from '../utils/filtration.js'

export const getCharacters = async (request, response) => {
    const characters = await Character.find();
    return response.code(200).send(characters)
}

export const getCharacterById = async (request, response) => {
    const objectId = toObjectId(request.params.id, response)

    const character = await populateCharacter(
        Character.findById(objectId)
    ).exec();

    if (!character) {
        return response.code(404).send({ error: `Character with ID ${objectId} not found` })
    }

    sortFields(character)

    return response.code(200).send(character)
}

export const createCharacter = async (request, response) => {

    const character_data = request.body
    const session = await Session.findById(character_data.session)

    if (character_data.health) character_data.health.forEach(h => addId(h))

    character_data.characteristics = toSessionCharacteristics(character_data.characteristics ?? {}, session.characteristicsList)
    character_data.currency = toSessionCurrency(character_data.currency ?? [], session.currencyTypes)

    const character = await Character.create(character_data)
    if (!character) {
        return response.code(404).send({ error: 'Can`t create character' })
    }
    await addItem({ sessionId: character_data.session, id: character.id, field: 'characters' }, response)

    return response.code(201).send(character)
}

export const updateCharacter = async (request, response) => {

    const objectId = toObjectId(request.params.id, response)
    const character_data = request.body

    if (character_data.health) character_data.health.forEach(h => addId(h))

    const character = await populateCharacter(
        Character.findByIdAndUpdate(objectId, character_data, { new: true, runValidators: true })
    ).exec();

    if (!character) {
        return response.code(404).send({ error: `Character with ID ${objectId} not found` })
    }

    sortFields(character)

    return response.code(200).send(character)
}

export const deleteCharacter = async (request, response) => {
    const objectId = toObjectId(request.params.id, response)

    const character = await Character.findByIdAndDelete(objectId)
    if (!character) {
        return response.code(404).send({ error: `Character with ID ${objectId} not found` })
    }

    await removeItem({ sessionId: character.session, id: character.id, field: 'characters' })
    return response.code(200).send({ status: 'Success', id: character.id })
}

function sortFields(character){
    sortByTwoFields(character.perks, 'type', 'name')
    sortByTwoFields(character.entities, 'type', 'name')
}