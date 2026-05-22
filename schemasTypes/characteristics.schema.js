import mongoose from "mongoose";

const characteristics = new mongoose.Schema(
    {
        name: String,
        value: {
            type: mongoose.Schema.Types.Mixed,
            validate: {
                validator: function (v) {
                    return ['string', 'number'].includes(typeof v);
                },
                message: 'Field must be string or number',

            }
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

characteristics.virtual('id').get(function () {
    return this._id.toString()
})

export default characteristics