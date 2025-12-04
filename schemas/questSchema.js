import mongoose from "mongoose"

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
        enum: ['done', 'active', 'hidden', 'fail'],
        default: 'hidden'
    },
    reward: {
        type: String,
        trim: true
    },
    steps: {
        type: [Object],
        name: {
            type: String,
            trim: true,
            default: null
        },
        status: {
            type: String,
            trim: true,
            default: null
        },
        reward: {
            type: String,
            trim: true,
            default: null
        }
    },
    adminNotes: {
        type: Array,
        default: null
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


export default mongoose.model('Quest', questSchema)