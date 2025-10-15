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
        type: Array,
        default: 0
    },
    characteristics: {
        type: Object,
        default: null
    },
    customFields: {
        type: Object,
        default: null
    },
    effects: {
        type: [Object],
        default: null
    },
    adminNotes:{
        type: Array,
        default: null
    },
    playerNotes:{
        type: Array,
        default: null
    },
    session: {
        type: mongoose.Schema.ObjectId,
        ref: 'Session',
        require: [true, 'Character should have a session']
    },
    quest: {
        type: mongoose.Schema.ObjectId,
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
