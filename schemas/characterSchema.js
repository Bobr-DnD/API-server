import mongoose from 'mongoose'

const characterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Character should have a name'],
        unique: false,
        trim: true
    },
    image: {
        type: String,
        required: [true, 'Character should have a photo'],
        trim: true
    },
    gender: { //make it enum later
        type: String,
        default: null
    },
    class: { //make enum later
        type: String,
        default: null
    },
    level: {
        type: Number,
        default: 0
    },
    experience: {
        type: Number,
        default: 0
    },
    experienceToLevelUp: {
        type: Number,
        default: 10
    },
    perkPoints: {
        type: Number,
        default: 0
    },
    health: {
        type: Number,
        default: 0
    },
    maxHealth: {
        type: Number,
        default: 0
    },
    healing: {
        type: Number,
        default: 0
    },
    characteristics: {
        type: Object,
        default: {}
    },
    customFields: {
        type: Object,
        default: {}
    },
    quest: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Quest',
        default: null
    },
    weapons: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Weapon',
        default: []
    },
    armor: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Armor',
        default: []
    },
    perks: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Perk',
        default: []
    },
    medicines: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Medicine',
        default: []
    },
    effects: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Effect',
        default: []
    },
    inventory: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Inventory',
        default: []
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

export default mongoose.model('Character', characterSchema)
