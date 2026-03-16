import mongoose from "mongoose"
import questStep from '../schemasTypes/questStep.schema.js'

const questSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Quest should have a name'],
        trim: true
    },
    description:{
        type: String,
        required: [true, 'Quest should have a descritpion'],
        trim: true
    },
    status: {
        type: String,
        required: [true, 'Quest should have a status'],
        trim: true
    },
    reward: {
        type: String,
        trim: true
    },
    steps: {
        type: [questStep],
    },
    notes:{
        type: String,
        default: null
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


export default mongoose.model('Quest', questSchema)