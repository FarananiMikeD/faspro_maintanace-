const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const intentSecretKeySchema = new Schema({
    object: {
        type: String,
        default: "intent_secret_key",
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    intentSecretKey: {
        type: String,
        required: true,
    },
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

intentSecretKeySchema.pre(/^find/, function (next) {
    this.populate({
        path: 'userId',
        select: 'firstName lastName photo email phoneNumber ',
    })
    next();
});

const IntentSecretKey = mongoose.model("IntentSecretKey", intentSecretKeySchema);

module.exports = IntentSecretKey;