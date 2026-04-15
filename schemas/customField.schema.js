import mongoose from "mongoose";

const customFieldSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        value: {
            type: mongoose.Schema.Types.Mixed,
            validate: {
                validator: function (v) {
                    return ['string', 'number'].includes(typeof v);
                },
                message: 'Field must be string or number',

            }
        },
        required: true
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }

    }
)

customFieldSchema.virtual('id').get(function () {
    return this._id.toString()
})

export default customFieldSchema