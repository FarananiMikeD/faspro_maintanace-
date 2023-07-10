const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require('moment');

const statisticSchema = new Schema({
    object: {
        type: String,
        default: "statistics",
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    propertyId: {
        type: Schema.Types.ObjectId,
        ref: "Properties",
        required: true
    },
    occupiedUnit: {
        type: Number,
    },
    occupiedUnitDocs: [{
        type: Schema.Types.ObjectId,
        ref: "Units",
    }],
    numberOfBlocks: {
        type: Number,
    },
    numberOfLeases: {
        type: Number,
    },
    unoccupiedUnit: {
        type: Number,
    },
    numberOfUnits: {
        type: Number,
    },
    total_Paid_RentAmount: {
        type: Number,
    },
    total_Paid_UtilityRentAmount: {
        type: Number,
    },
    total_Paid_ExtraChargesRentAmount: {
        type: Number,
    },
    total_Paid_OfAll: {
        type: Number,
    },
    total_Pending_RentAmount: {
        type: Number,
    },
    total_Pending_UtilityRentAmount: {
        type: Number,
    },
    total_Pending_ExtraChargesRentAmount: {
        type: Number,
    },
    total_Pending_OfAll: {
        type: Number,
    },
    total_Overdue_RentAmount: {
        type: Number,
    },
    total_Overdue_UtilityRentAmount: {
        type: Number,
    },
    total_Overdue_ExtraChargesRentAmount: {
        type: Number,
    },
    total_Overdue_OfAll: {
        type: Number,
    },
    month: {
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

statisticSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'userId',
        select: 'firstName lastName profilePic email phoneNumber companyName registrationNumber vatNumber street suburb city state country zip',
    })
    next();
});

statisticSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'propertyId',
        select: 'propertyName propertyType buildingName address city country postalCode propertyImage propertyBlock',
    })
    this.populate({
        path: 'occupiedUnitDocs',
        select: 'unitName unitNumber',
    })
    next();
});



statisticSchema.pre('save', function (next) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentDate = new Date();
    const currentMonth = monthNames[currentDate.getMonth()];
    const currentDay = moment(currentDate).format('DD');

    if (!this.month) {
        this.month = `${currentMonth} - ${currentDay}`;
    }
    next();
});


const Statistics = mongoose.model("Statistics", statisticSchema);

module.exports = Statistics;