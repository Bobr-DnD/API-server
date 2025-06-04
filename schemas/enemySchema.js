import mongoose from "mongoose";

const enemySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Enemy should have a name'],
        unique: false,
        trim: true
    },
    photo: {
        type: String,
        required: [true, 'Enemy should have a photo'],
        trim: true
    },
    gender: {
        type: String,
        default: null
    },
    class: {
        type: String,
        default: null
    },
    level: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        enum: ['mini-boss', 'boss', 'creepok'],
        default: 'creepok'
    },
    health: {
        type: Number,
        default: 10
    },
    resist: {
        type: Number,
        default: 0
    },
    damage: {
        type: String,
        default: null
    },
    actionPoints: {
        type: Number,
        default: 0
    },
    ability: {
        type: String,
        default: null
    },
    characteristics: {
        type: Object,
        default: {}
    },
    customFields: {
        type: Object,
        default: {}
    },
    weapons: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Weapon',
        default: null
    },
    armor: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Armor',
        default: []
    },
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

export default mongoose.model('Enemy', enemySchema)
