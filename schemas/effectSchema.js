import mongoose from "mongoose";

const effectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Effect should have a name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Effect should have a description'],
        trim: true
    },
    effect: {
        type: Object,
        default: null
    },
    duration: {
        type: Number,
        default: 4
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

export default mongoose.model('Effect', effectSchema);