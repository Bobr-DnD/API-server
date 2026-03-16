import mongoose, { mongo } from "mongoose";

const perkTypeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true
        },
        color: {
            type: String,
            trim: true
        }
    },
    { _id: false }
)

export default perkTypeSchema