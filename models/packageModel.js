const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require('moment');

const subscriptionPackageSchema = new Schema({
    object: {
        type: String,
        default: "packages",
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        // required: true
    },
    name: {
        type: String,
        // required: true
    },
    price: {
        type: Number,
        // required: true
    },
    module: {
        type: String,
    },
    numberOfUnits: {
        type: Number,
        // required: [true, "Number of units is required"],
    },
    numberOfUsers: {
        type: Number,
        // required: [true, "Number of users is required"],
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

    numberOfServiceProviders: {
        type: Number,
        // required: true,
    },
    numberOfSecurities: {
        type: Number,
        // required: true,
    },
    numberOfFAssets: {
        type: Number,
        // required: true,
    },
    numberOfFilesDocs: {
        type: Number,
        // required: true,
    },
    description: {
        type: String,
        // required: true
    },
    //* the duration of the package (e.g. "monthly", "yearly")
    duration: {
        type: String,
        required: true,
        enum: ["monthly", "yearly", "5min", "30min"]
    },
    //*  an array of strings that lists the features that come with this package
    features: {
        type: [String],
        // required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    subscriptionStart: { type: Date, default: null },
    subscriptionEnd: { type: Date, default: null }
},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// subscriptionPackageSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: 'userId',
//         select: 'firstName lastName photo email phoneNumber ',
//     })
//     next();
// });


// assuming you have a `duration` field that can be either 'monthly' or 'yearly'
subscriptionPackageSchema.pre('save', function (next) {
    const duration = this.duration;
    const now = moment();

    // set the start date to the current date
    this.subscriptionStart = now.toDate();

    if (duration === 'monthly') {
        // set the end date to one month from now
        this.subscriptionEnd = now.add(1, 'month').toDate();
    } else if (duration === 'yearly') {
        // set the end date to one year from now
        this.subscriptionEnd = now.add(1, 'year').toDate();
    } else if (duration === '5min') {
        // set the end date to 5 minutes from now
        this.subscriptionEnd = now.add(5, 'minutes').toDate();
    }
    else if (duration === '30min') {
        // set the end date to 30 minutes from now
        this.subscriptionEnd = now.add(30, 'minutes').toDate();
    }
    next();
});


const SubscriptionPackage = mongoose.model("SubscriptionPackage", subscriptionPackageSchema);

module.exports = SubscriptionPackage;