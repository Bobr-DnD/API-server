import mongoose from "mongoose"

const loadoutsLimitSchema = new mongoose.Schema(
    {
        loadouts: {
            type: Number,
            default: null,
            min: 1
        },
        items: {
            type: Number,
            default: null,
            min: 1
        },
        perks: {
            type: Number,
            default: null,
            min: 1
        }
    },
    {
        _id: false
    }
)

export default loadoutsLimitSchema