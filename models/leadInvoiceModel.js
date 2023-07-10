const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leadInvoiceSchema = new Schema({
    object: {
        type: String,
        default: "leadInvoices",
    },
    invoiceNumber: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    userWhoCancelInvId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    userWhoChangeStatusToPaidInvoice: {
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
    subTotalAmount: {
        type: Number,
    },
    discountAmount: {
        type: Number,
    },
    vatAmount: {
        type: String,
    },
    total_with_or_without_dis: {
        type: Number,
    },
    total_with_or_without_vat: {
        type: Number,
    },
    reasonForCancelInvoice: {
        type: String,
    },
    dueDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['cancel', 'paid', 'pending'],
        default: "pending",
    },
},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

leadInvoiceSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'userId',
        select: 'firstName lastName profilePic email phoneNumber ',
    });
    this.populate({
        path: 'leadId',
        select: 'firstName lastName email phoneNumber ',
    });
    this.populate({
        path: 'userWhoCancelInvId',
        select: 'firstName lastName email phoneNumber ',
    });
    this.populate({
        path: 'userWhoChangeStatusToPaidInvoice',
        select: 'firstName lastName email phoneNumber ',
    });
    next();
});


const leadInvoices = mongoose.model("leadInvoices", leadInvoiceSchema);

module.exports = leadInvoices;