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
        default: {
            name: "quest name",
            status: "hidden",
            requirement: "2 Strength",
            reward: "10 монет"
        }
    },
    adminNotes:{
        type: Array,
        default: null
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


export default mongoose.model('Quest', questSchema)