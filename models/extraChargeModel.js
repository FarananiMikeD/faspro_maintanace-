const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const extraChargeSchema = new Schema({
    object: {
        type: String,
        default: "extraCharges",
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
    //* This field should indicate the type of charge being applied, such as "maintenance fee," "parking fee," "late fee," or "pet fee," among others.
    type: {
        type: String,
        required: true
    },
    //*This field should indicate the amount of the charge being applied, either as a fixed amount or a percentage of the rent or lease amount.
    amount: {
        type: Number
    },
    //* This field should indicate how often the charge will be applied, such as monthly, quarterly, or annually.
    frequency: {
        type: String
    },
    //* This field should indicate when the charge will first be applied, either at the beginning of a lease or at a specific date.
    startDate: {
        type: Date,
        required: true
    },
    //* This field should indicate when the charge will no longer be applied, either at the end of a lease or at a specific date.
    endDate: {
        type: Date,
    },
    //* This field should include any additional terms and conditions related to the charge, such as penalties for late payments or restrictions on the use of common areas.
    termsAndConditions: {
        type: Boolean,
        // required: true
        default: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
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

extraChargeSchema.pre(/^find/, function (next) {
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

const ExtraCharges = mongoose.model("ExtraCharges", extraChargeSchema);

module.exports = ExtraCharges;