const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noticeSchema = new Schema({
    object: {
        type: String,
        default: "notices",
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
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    noticeDocument: {
        type: String,
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

noticeSchema.pre(/^find/, function (next) {
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


const Notices = mongoose.model("Notices", noticeSchema);

module.exports = Notices;