import mongoose from "mongoose"

const armorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Armor should have a name'],
        trim: true
    },
    type: {
        type: String,
        default: 'outerwear',
        trim: true
    },
    resist: {
        type: Number,
        default: 0
    },
    effect: {
        type: Object,
        default: null
    },
    requirement: {
        type: Object,
        default: null
    },
    price: {
        type: Number,
        default: 0
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

export default mongoose.model('Armor', armorSchema)