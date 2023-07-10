const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leadSchema = new Schema({
    object: {
        type: String,
        default: "leads",
    },
    salesId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    invoiceId: {
        type: String,
        // ref: "leadInvoices",
    },
    email: {
        type: String,
        // required: true
    },
    companyName: {
        type: String,
    },
    phoneNumber: {
        type: String,
        // required: true
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    companySize: {
        type: String,
    },
    interestedModules: {
        type: [String],
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['new', 'pending', 'qualify', 'un-qualify', 'waiting'],
        default: "new",
    },
    quotationStatus: {
        type: Boolean,
        default: false,
    },
    organizationType: {
        type: String,
    },
    invoiceStatus: {
        type: Boolean,
        default: false,
    },
},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

leadSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'salesId',
        select: 'firstName lastName profilePic email',
    });
    next();
});


const Leads = mongoose.model("Leads", leadSchema);

module.exports = Leads;