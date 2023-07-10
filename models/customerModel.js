const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    customerId: {
        type: String,
        required: true,
    },
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// customerSchema.index({ customerId: 1 }, { unique: true });

customerSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'userId',
        select: 'firstName lastName photo email phoneNumber ',
    })
    next();
});

const Customer = mongoose.model("Customers", customerSchema);

module.exports = Customer;