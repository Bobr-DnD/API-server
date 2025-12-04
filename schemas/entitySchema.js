import mongoose from "mongoose";

const entitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Entity should have a name'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Entity should have a type'],
        trim: true
    },
    image: {
        type: String,
        default: null
    },
    adminNotes: {
        type: [String],
        default: []
    },
    rangeFields: {
        type: [Object],
        default: []
    },
    characteristics: {
        type: [Object],
        default: []
    },
    requirement: {
        type: Object,
        default: null
    },
    effects: {
        type: [mongoose.Schema.ObjectId],
        ref: "Effect",
        default: []
    },
    description: {
        type: String,
        default: null,
        trim: true
    },
    price: {
        type: Number,
        default: null
    },
    usage: {
        type: Number,
        default: null
    },
    rarity: {
        type: String,
        default: null
    }

},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

export default mongoose.model('Entity', entitySchema);