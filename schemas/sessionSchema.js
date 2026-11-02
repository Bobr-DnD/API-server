import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import iconType from "../schemasTypes/typeWithIcon.schema.js";
import colorType from "../schemasTypes/typeWithColor.schema.js"
import nameType from "../schemasTypes/TypeWithName.schema.js"
import customField from "../schemasTypes/customField.schema.js";
import loadoutLimitsSchema from '../schemasTypes/loadoutLimits.schema.js';

const sessionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Session should have a name'],
        trim: true
    },
    image: {
        type: String,
        trim: true,
        default: null
    },
    password: {
        type: String,
        minLength: 8,
        select: false,
        required: [true, 'Session should have a password']
    },
    adminPassword: {
        type: String,
        minLength: 8,
        select: false,
        required: [true, 'Session should have an admin password']
    },
    customFields: {
        type: [customField],
        default: []
    },
    notes: {
        type: String,
        default: null
    },
    entityTypes: {
        type: [iconType],
        default: [],
    },
    currencyTypes: {
        type: [iconType],
        default: []
    },
    characteristicsList: {
        type: [nameType],
        default: []
    },
    perkTypes: {
        type: [colorType],
        default: [],
    },
    characters: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Character',
        default: []
    },
    entities: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Entity',
        default: []
    },
    perks: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Perk',
        default: []
    },
    effects: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Effect',
        default: []
    },
    loadoutsLimit: {
        type: loadoutLimitsSchema,
        default: () => ({})
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

const PASSWORD_FIELDS = ['password', 'adminPassword']

sessionSchema.pre('save', async function (next) {
    try {
        for (const field of PASSWORD_FIELDS) {
            if (this.isModified(field)) {
                const salt = await bcrypt.genSalt(10);
                this[field] = await bcrypt.hash(this[field], salt);
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

sessionSchema.pre('findOneAndUpdate', async function () {
    const update = this.getUpdate();

    for (const field of PASSWORD_FIELDS) {
        const value = update?.[field] || update.$set?.[field]
        if (!value) continue

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(value, salt);

        if (update.$set) {
            update.$set[field] = hashed;
        } else {
            this.set({ [field]: hashed });
        }
    }
})

sessionSchema.methods.comparePassword = async function (candidatePasword, field = 'password') {
    if (!this[field]) return false
    return await bcrypt.compare(candidatePasword, this[field])
}

export default mongoose.model('Session', sessionSchema)