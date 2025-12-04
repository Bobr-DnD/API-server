import mongoose, { mongo } from "mongoose";

const sessionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Session should have a name'],
        trim: true
    },
    image:{
        type: String,
        trim: true,
        default: null
    },
    currency: {
        type: Object,
        default: null
    },
    move: {
        type: Number,
        default: 0
    },
    customFields: {
        type: Object,
        default: null
    },
    adminNotes:{
        type: Array,
        default: null
    },
    entityTypes:{
        type: [String],
        default: ['Armor', 'Weapon', 'Medicine']
    },
    enemytypes: {
        type: [String],
        default: ['boss', 'enemy']
    },
    characters: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Character',
        default: []
    },
    entities:{
        type: [mongoose.Schema.ObjectId],
        ref: 'Entity',
        default: []
    },
    enemies:{
        type: [mongoose.Schema.ObjectId],
        ref: 'Enemy',
        default: []
    },
    perks:{
        type: [mongoose.Schema.ObjectId],
        ref: 'Perk',
        default: []
    },
    effects:{
        type: [mongoose.Schema.ObjectId],
        ref: 'Effect',
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
        default: []
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


export default mongoose.model('Session', sessionSchema)