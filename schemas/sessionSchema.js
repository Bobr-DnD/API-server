import mongoose, { mongo } from "mongoose";

const sessionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Session should have a name'],
        trim: true
    },
    image:{
        type: String,
        trim: true
    },
    currency: {
        type: Object,
        default: {
            "Money": 0
        }
    },
    move: {
        type: Number,
        default: 0
    },
    customFields: {
        type: Object,
        default: {}
    },
    characters: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Character',
        default: []
    },
    fractions: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Fraction',
        default: []
    },
    quests: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Quest',
        default: null
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


export default mongoose.model('Session', sessionSchema)