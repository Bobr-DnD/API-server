import mongoose from "mongoose"

const weaponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Weapon should have a name'],
        trim: true
    },
    range: {
        type: Number,
        default: 2
    },
    actionPoints: {
        type: Number,
        default: 1
    },
    damage: {
        type: Array
    },
    customFields:{
        type: Array,
        default: null
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
