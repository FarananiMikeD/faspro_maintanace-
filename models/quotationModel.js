const { boolean } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quotationSchema = new Schema({
    object: {
        type: String,
        default: "quotations",
    },
    quotationNumber: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    leadId: {
        type: Schema.Types.ObjectId,
        ref: "Leads",
    },
    numberOfUnits: {
        type: String,
        required: true
    },
    numberOfUsers: {
        type: String,
        required: true
    },
    numberOfUnitsAmount: {
        type: Number,
    },
    numberOfUsersAmount: {
        type: Number,
    },
    discountPercentage: {
        type: Number,
    },
    vatPercentage: {
        type: String,
    },
    discountAmount: {
        type: Number,
    },
    vatAmount: {
        type: String,
    },
    maintenance: {
        type: String,
    },
    security: {
        type: String,
    },
    assets: {
        type: String,
    },
    fileManagement: {
        type: String,
    },
    bookings: {
        type: String,
    },
    facility: {
        type: String,
    },
    maintenancePrice: {
        type: Number,
    },
    securityPrice: {
        type: Number,
    },
    assetsPrice: {
        type: Number,
    },
    fileManagementPrice: {
        type: Number,
    },
    bookingsPrice: {
        type: Number,
    },
    facilityPrice: {
        type: Number,
    },
    totalAmount: {
        type: Number,
    },
    total_with_or_without_dis: {
        type: Number,
    },
    total_with_or_without_vat: {
        type: Number,
    },
    dueDate: {
        type: Date,
    },
    invoiceStatus: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'canceled', 'finalized'],
        default: "pending",
    },
},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

quotationSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'userId',
        select: 'firstName lastName profilePic email phoneNumber ',
    });
    this.populate({
        path: 'leadId',
        select: 'firstName lastName  email phoneNumber ',
    });
    next();
});


const quotations = mongoose.model("quotations", quotationSchema);

module.exports = quotations;