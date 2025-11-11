import Armor from '../schemas/armorSchema.js'
import Effect from '../schemas/effectSchema.js'
import Fraction from '../schemas/fractionSchema.js'
import Inventory from '../schemas/inventorySchema.js'
import Perk from '../schemas/perkSchema.js'
import Quest from '../schemas/questSchema.js'
import Weapon from '../schemas/weaponsSchema.js'
import { getEntities, getEntityById, createEntity, updateEntity, deleteEntity } from '../controllers/commonController.js'

export default async function commonRouter(fastify, opts) {
    const collection = () => fastify.mongo.db.collection(opts.collection)
    const models = {
        Armor,
        Effect,
        Fraction,
        Inventory,
        Perk,
        Quest,
        Weapon
    }
    const model = models[opts.model]
    
    fastify.get('/', getEntities(collection));
    fastify.get('/:id', getEntityById(collection));
    fastify.post('/', createEntity(model, opts.collection))
    fastify.patch('/:id', updateEntity(model))
    fastify.delete('/:id', deleteEntity(collection))
}
