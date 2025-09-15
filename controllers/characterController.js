import Character from '../schemas/characterSchema.js'
import { toObjectId } from '../utils/ObjectIdConverter.js'
import { populateEffects } from '../utils/characterHelper.js'
import { populateCharacter } from '../utils/entityPopulator.js'

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

    character.effects = await populateEffects(character.effects);

    return response.code(200).send(character)
}

export const createCharacter = async (request, response) => {
    const character = await Character.create(request.body)
    if (!character) {
        return response.code(404).send({ error: 'Can`t create character' })
    }
    return response.code(201).send(character)
}

export const updateCharacter = async (request, response) => {
    const objectId = toObjectId(request.params.id, response)

    const character = await populateCharacter(
        Character.findByIdAndUpdate(objectId, request.body, {new: true, runValidators: true})
    ).exec();

    character.effects = await populateEffects(character.effects);


    if (!character) {
        return response.code(404).send({ error: `Character with ID ${objectId} not found` })
    }

    return response.code(200).send(character)
}

export const deleteCharacter = async (request, response) => {
    const objectId = toObjectId(request.params.id, response)

    const character = await Character.findByIdAndDelete(objectId)
    if (!character) {
        return response.code(404).send({ error: `Character with ID ${objectId} not found` })
    }

    return response.code(200).send({ status: 'Success' })
}