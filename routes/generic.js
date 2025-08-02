import Armor from '../schemas/armorSchema.js'
import Effect from '../schemas/effectSchema.js'
import Fraction from '../schemas/fractionSchema.js'
import Inventory from '../schemas/inventorySchema.js'
import Perk from '../schemas/perkSchema.js'
import Quest from '../schemas/questSchema.js'
import Weapon from '../schemas/weaponsSchema.js'
import {commonRoutes} from '../plugins/commonController.js'

export default async function genericRouteHandler(fastify, opts) {
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
    commonRoutes(fastify, {path:'/', model, collection})
}
