import mongoose from "mongoose";

const enemySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Enemy should have a name'],
        unique: false,
        trim: true
    },
    image: {
        type: String,
        default: null,
        trim: true
    },
    gender: {
        type: String,
        trim: true,
        default: null
    },
    class: {
        type: String,
        trim: true,
        default: null
    },
    race: {
        type: String,
        tri: true,
        default: null
    },
    level: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        trim: true,
        default: null
    },
    health: {
        type: Number,
        default: 10
    },
    characteristics: {
        type: Object,
        default: null
    },
    customFields: {
        type: Object,
        default: null
    },
    abilities: {
        type: [String],
        default: []
    },
    entities: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Entity',
        default: []
    },
    adminNotes: {
        type: [String],
        default: []
    },
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

export default mongoose.model('Enemy', enemySchema)
