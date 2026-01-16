import mongoose from "mongoose";
import bcrypt from 'bcrypt';

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
    //TODO probably move is not important field
    // move: {
    //     type: Number,
    //     default: 0
    // },
    customFields: {
        type: Object,
        default: {}
    },
    notes: {
        type: String,
        default: null
    },
    entityTypes: {
        type: [Object],
        default: [],
        id: String,
        icon: String,
        name: String
    },
    currencyTypes: {
        type: [Object],
        default: [],
        id: String,
        name: String,
        icon: String
    },
    characteristicsList: {
        type: [Object],
        default: [],
        id: String,
        name: String
    },
    questTypes: {
        type: [Object],
        default: [],
        id: String,
        name: String
    },
    perkTypes: {
        type: [Object],
        default: [],
        id: String,
        name: String,
        color: String
    },
    enemyTypes: {
        type: [Object],
        default: [],
        id: String,
        name: String,
        icon: String
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
    enemies: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Enemy',
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
    quests: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Quest',
        default: []
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

sessionSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

sessionSchema.pre('findOneAndUpdate', async function () {
    const update = this.getUpdate();

    const password = update.password || update.$set.password
    if (!password) {
        return;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (update.$set) {
            update.$set.password = hashedPassword;
        } else {
            this.set({ password: hashedPassword });
        }
    } catch (error) {
        throw error;
    }

})

sessionSchema.methods.comparePassword = async function (candidatePasword) {
    return await bcrypt.compare(candidatePasword, this.password)
}

export default mongoose.model('Session', sessionSchema)