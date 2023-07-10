const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const utilitySchema = new Schema({
    object: {
        type: String,
        default: "utilities",
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
    utilityName: {
        type: String,
        required: true
    },
    //* Utility Type - A field to identify the type of the utility. This can be electricity, gas, water, internet, etc.
    type: {
        type: String,
        required: true
    },
    //* Utility Provider - The company or organization that provides the utility.
    provider: {
        type: String
    },
    //* Meter Number - The unique identifier for the meter associated with the utility.
    meterNumber: {
        type: String
    },
    //* Rate - The rate at which the utility is charged. This can be a flat rate or a rate that varies based on usage.
    rate: {
        type: Number,
        required: true
    },
    //* Start Date - The date on which the utility service begins.
    startDate: {
        type: Date,
        required: true
    },
    //* End Date - The date on which the utility service ends.
    endDate: {
        type: Date,
    },
    //* Status - A field to indicate whether the utility is active or inactive.
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    //* Consumption - The amount of the utility consumed over a given period of time, such as a month.
    consumption: {
        type: Number,
        required: true,
        default: 0
    },
    //* Cost - The cost of the utility consumed over a given period of time, such as a month.
    cost: {
        type: Number,
        required: true,
        default: 0
    },
    //* Billing Period - The billing period for the utility. This could be monthly, quarterly, or any other interval.
    billingPeriod: {
        type: String,
        required: true
    },
    //* Payment Status - A field to indicate whether the utility bill has been paid or not.
    paymentStatus: {
        type: String,
        enum: ['paid', 'unpaid'],
        default: 'unpaid'
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

utilitySchema.pre(/^find/, function (next) {
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

const Utilities = mongoose.model("Utilities", utilitySchema);

module.exports = Utilities;