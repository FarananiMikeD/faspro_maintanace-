const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    subscriptionId: {
        type: String,
        required: true,
    },
    clientSecret: {
        type: String,
        required: true,
    },
    // paymentIntentSecretKey: {
    //     type: String,
    // },
    // date: {
    //     type: Date,
    //     default: Date.now
    // },
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// subscriptionSchema.index({ subscriptionId: 1 }, { unique: true });

subscriptionSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'userId',
        select: 'firstName lastName photo email phoneNumber ',
    })
    next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;