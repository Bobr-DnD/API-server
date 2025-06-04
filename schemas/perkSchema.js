import mongoose from "mongoose"

const perkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Perk should have a name'],
        trim: true
    },
    effect: {
        type: Object,
        required: [true, 'Perk should have an effect'],
        trim: true
    },
    requirement: {
        type: Object,
        default: null
    },
    cooldown: {
        type: Number,
        default: null
    },
    ranks: {
        type: Number,
        default: 0
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })


export default mongoose.model('Perk', perkSchema)