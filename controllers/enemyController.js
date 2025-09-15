import Enemy from '../schemas/enemySchema.js'
import { toObjectId } from '../utils/ObjectIdConverter.js'
import { populateEnemy } from '../utils/entityPopulator.js';

export const getEnemies = async (request, response) => {
    const enemies = await Enemy.find();
    return response.code(200).send(enemies)
}

export const getEnemyById = async (request, response) => {
    const objectId = toObjectId(request.params.id, response)

    const enemy = await populateEnemy(
        Enemy.findById(objectId)
    ).exec();

    if (!enemy) {
        return response.code(404).send({ error: `Enemy with ID ${objectId} not found` })
    }

    return response.code(200).send(enemy)
}

export const createEnemy = async (request, response) => {
    const enemy = await Enemy.create(request.body)
    if (!enemy) {
        return response.code(404).send({ error: 'Can`t create enemy' })
    }
    return response.code(201).send(enemy)
}

export const updateEnemy = async (request, response) => {
    const objectId = toObjectId(request.params.id, response)

    const enemy = await populateEnemy(
        Enemy.findByIdAndUpdate(objectId, request.body, {new: true, runValidators: true})
    ).exec();

    if (!enemy) {
        return response.code(404).send({ error: `Enemy with ID ${objectId} not found` })
    }

    return response.code(200).send(enemy)
}

export const deleteEnemy = async (request, response) => {
    const objectId = toObjectId(request.params.id, response)

    const enemy = await Enemy.findByIdAndDelete(objectId)
    if (!enemy) {
        return response.code(404).send({ error: `Enemy with ID ${objectId} not found` })
    }

    return response.code(200).send({ status: 'Success' })
}