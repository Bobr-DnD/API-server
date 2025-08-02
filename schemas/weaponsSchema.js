import mongoose from "mongoose"

const weaponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Weapon should have a name'],
        trim: true
    },
    range: {
        type: Number,
        enum: [1, 2, 3],
        default: 2
    },
    type: {
        type: String,
        default: null
    },
    specific: {
        type: String,
        default: null
    },
    actionPoints: {
        type: Number,
        default: 0
    },
    damage: {
        type: String,
        default: '1d6'
    },
    requirement: {
        type: Object,
        default: null
    },
    effect: {
        type: String,
        default: null
    },
    price: {
        type: Number,
        default: 0
    },
    legendary: {
        type: Boolean,
        default: false
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

export default mongoose.model('Weapon', weaponSchema)
