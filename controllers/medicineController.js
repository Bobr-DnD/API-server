import Medicine from '../schemas/medicinesSchema.js'
import { toObjectId } from '../utils/ObjectIdConverter.js'
import { populateMedicine } from '../utils/entityPopulator.js';
import { addItem } from './sessionController.js';

export const getMedicines = async (request, response) => {
    const medicines = await Medicine.find();
    return response.code(200).send(medicines)
}

export const getMedicineById = async (request, response) => {
    const objectId = toObjectId(request.params.id, response)

    const medicine = await populateMedicine(
        Medicine.findById(objectId)
    ).exec();

    if (!medicine) {
        return response.code(404).send({ error: `Medicine with ID ${objectId} not found` })
    }

    return response.code(200).send(medicine)
}

export const createMedicine = async (request, response) => {
    const medicine = await Medicine.create(request.body)
    if (!medicine) {
        return response.code(404).send({ error: 'Can`t create medicine' })
    }

    addItem({sessionId: request.body.session, id: medicine.id, field: 'medicines'})

    return response.code(201).send(medicine)
}

export const updateMedicine = async (request, response) => {
    const objectId = toObjectId(request.params.id, response)

    const medicine = await populateMedicine(
        Medicine.findByIdAndUpdate(objectId, request.body, {new: true, runValidators: true})
    ).exec();

    if (!medicine) {
        return response.code(404).send({ error: `Medicine with ID ${objectId} not found` })
    }

    return response.code(200).send(medicine)
}

export const deleteMedicine = async (request, response) => {
    const objectId = toObjectId(request.params.id, response)

    const medicine = await Medicine.findByIdAndDelete(objectId)
    if (!medicine) {
        return response.code(404).send({ error: `Medicine with ID ${objectId} not found` })
    }

    return response.code(200).send({ status: 'Success' })
}