const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaseSchema = new Schema({
    object: {
        type: String,
        default: "leases",
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
    rentDeposit: {
        type: Number,
    },
    rentAmount: {
        type: Number,
        required: true
    },
    latePaymentPercentage: {
        type: Number,
    },
    latePaymentFee: {
        type: Number,
    },
    gracePeriod: {
        type: Number,
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    leaseAgreement: {
        type: String,
    },
    duration: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    paymentDueDate: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return v >= 1 && v <= 31;
            },
            message: props => `${props.value} is not a valid payment due date!`
        }
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

//* Calculate the rent and the percentage to get the late payment fee. this is when adding a new lease
leaseSchema.pre('save', function (next) {
    const rentAmount = this.rentAmount;
    const latePaymentPercentage = this.latePaymentPercentage;
    if (rentAmount && latePaymentPercentage) {
        const latePaymentFee = rentAmount * (latePaymentPercentage / 100);
        this.latePaymentFee = latePaymentFee;
    }
    next();
});

//* Calculate the rent and the percentage to get the late payment fee. this is when updating a new lease
leaseSchema.pre('findOneAndUpdate', function (next) {
    const rentAmount = this._update.rentAmount;
    const latePaymentPercentage = this._update.latePaymentPercentage;
    if (rentAmount && latePaymentPercentage) {
        const latePaymentFee = rentAmount * (latePaymentPercentage / 100);
        this._update.latePaymentFee = latePaymentFee;
    }
    next();
});

//* this calculate the start date and the en date, then create the duration
leaseSchema.virtual('leaseDuration').get(function () {
    const start = this.startDate;
    const end = this.endDate;
    const diffInMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return diffInMonths;
}).set(function (value) {
    // Setter function for "leaseDuration" virtual property
    // This function is called when start date or end date is modified
    const start = this.startDate;
    const end = new Date(start.getTime() + value * 30 * 24 * 60 * 60 * 1000);
    this.endDate = end;
});

// Middleware to set the lease duration before saving the document
leaseSchema.pre('save', function (next) {
    this.duration = this.leaseDuration;
    next();
});


leaseSchema.pre(/^find/, function (next) {
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

const Leases = mongoose.model("Leases", leaseSchema);

module.exports = Leases;