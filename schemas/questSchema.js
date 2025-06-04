import mongoose from "mongoose"

const questSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Quest should have a name'],
        trim: true
    },
    reward: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['done', 'active', 'hidden', 'fail'],
        default: 'hidden'
    },
    steps: {
        type: [Object],
        default: null
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


export default new mongoose.model('Quest', questSchema)