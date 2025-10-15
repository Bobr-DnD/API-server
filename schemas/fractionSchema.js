import mongoose from "mongoose"

const fractionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Fraction should have a name'],
        trim: true
    },
    adminNotes:{
        type: Array,
        default: null
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


export default mongoose.model('Fraction', fractionSchema)