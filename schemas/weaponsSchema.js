import mongoose from "mongoose"

const weaponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Weapon should have a name'],
        trim: true
    },
    range: {
        type: Object,
        default: {
            min: null,
            max: 1
        }
    },
    actionPoints: {
        type: Object,
        default:
        {
            min: null,
            max: 1
        }
    },
    damage: {
        type: Array,
        default: [
            {
                damage: "1d6",
                type: "Колючий"
            },
            {
                damage: "1d6+2",
                type: "Ріжучий/Рубаючий"
            }
        ]
    },
    adminNotes: {
        type: Array,
        default: null
    },
    requirement: {
        type: Object,
        default: null
    },
    effect: {
        type: String,
        default: null
    },
    price: {
        type: Number,
        default: 0
    },
    legendary: {
        type: Boolean,
        default: false
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

export default mongoose.model('Weapon', weaponSchema)
