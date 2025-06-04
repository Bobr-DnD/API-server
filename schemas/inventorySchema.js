import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Item should have a name'],
        trim: true
    },
    info: {
        type: String,
        required: [true, 'Item should have a description'],
        trim: true
    },
    price: {
        type: Number,
        default: 0
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

export default new mongoose.model('Inventory', inventorySchema);