import mongoose from "mongoose"

const perkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Perk should have a name'],
        trim: true
    },
    descriptions: {
        type: [String],
        required: [true, 'Perk should have a description'],
        trim: true
    },
    effects: {
        type: [Object],
        default: []
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
    },
    type: {
        type: String,
        enum: ['perk', 'status', 'skill', 'antiperk'],
        default: 'perk'
    },
    adminNotes: {
        type: Array,
        default: null
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })


export default mongoose.model('Perk', perkSchema)