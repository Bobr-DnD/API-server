import mongoose from "mongoose";

const questStep = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            default: null
        },
        status: {
            type: String,
            trim: true,
            default: null
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

questStep.virtual('id').get(function () {
    return this._id.toString()
})

export default questStep