const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Import the moment library to handle dates
const moment = require('moment');

const invoiceSchema = new Schema({
    object: {
        type: String,
        default: "invoices",
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    propertyId: {
        type: Schema.Types.ObjectId,
        ref: "Properties",
    },
    unitId: {
        type: Schema.Types.ObjectId,
        ref: "Units",
    },
    invoiceNumber: {
        type: String,
    },
    rentalAmount: {
        type: Number,
        required: true
    },
    utilityCharges: {
        type: Number,
        required: true
    },
    extraCharges: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    month: {
        type: String,
        // required: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'overdue'],
        default: 'pending'
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

invoiceSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'userId',
        select: 'firstName lastName profilePic email phoneNumber ',
    });
    this.populate({
        path: 'unitId',
        select: 'unitName unitNumber unitOwnerName numberOfBedrooms numberOfBathRooms unitType RentAmount parkingGarage floorNumber Amenities surfaceArea Description leaseTerm rentalRates maximumOccupancy Location CondoAssociationFees petPolicy propertyTaxes ',
    })
    this.populate({
        path: 'propertyId',
        select: 'propertyName propertyType buildingName address city country postalCode propertyBlock propertyImage propertyCategory',
    })
    next();
});


// Define a middleware function that sets the value of the month field to the name of the current month
invoiceSchema.pre('save', function (next) {
    // Get the current month as a string in the format "MMMM"
    const currentMonth = moment().format('MMMM');

    // Set the value of the month field to the current month
    this.month = currentMonth;

    // Call the next middleware function
    next();
});


const Invoices = mongoose.model("Invoices", invoiceSchema);

module.exports = Invoices;