import { getMedicines, getMedicineById, updateMedicine, deleteMedicine, createMedicine } from '../controllers/medicineController.js'

export default async function charactersRoute(fastify, opts) {
    fastify.get('/', getMedicines);
    fastify.get('/:id', getMedicineById);
    fastify.post('/', createMedicine);
    fastify.patch('/:id', updateMedicine);
    fastify.delete('/:id', deleteMedicine);
}
