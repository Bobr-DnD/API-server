import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Medicine should have a name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Medicine should have a description'],
        trim: true
    },
    effect: {
        type: mongoose.Schema.ObjectId,
        ref: "Effect",
        default: null
    },
    addictionEffect: {
        type: mongoose.Schema.ObjectId,
        ref: "Effect",
        default: null
    },
    addictionCondition: {
        type: String,
        default: null
    },
    price: {
        type: Number,
        default: 0
    },
    recipe: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Medicine',
        default: null
    },
    uses:{
        type: Number, 
        default: 1
    },
    adminNotes:{
        type: Array,
        default: null
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

export default mongoose.model('Medicine', medicineSchema);