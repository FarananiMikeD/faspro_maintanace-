const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invoiceSettingSchema = new Schema({
    object: {
        type: String,
        default: "invoiceSettings",
    },
    termsAndCondition: {
        type: String,
    },
    note: {
        type: String,
    },
    taxAmount: {
        type: Number,
    },
    bankName: {
        type: String,
    },
    accountNumber: {
        type: String,
    },
    accountName: {
        type: String,
    },
    branchName: {
        type: String,
    },
    address: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    email: {
        type: String,

    },
    status: {
        type: [String],
        enum: ['pending', 'canceled', 'paid'],
        default: "pending",
    },
},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);


const invoiceSettings = mongoose.model("InvoiceSettings", invoiceSettingSchema);

module.exports = invoiceSettings;