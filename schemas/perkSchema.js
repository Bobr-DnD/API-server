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
    /*effect structure: effect:{"description":"text if you need some", "A":1, "health":30} */
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
    adminNotes:{
        type: Array,
        default: null
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })


export default mongoose.model('Perk', perkSchema)