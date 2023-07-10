const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertySchema = new Schema({
    object: {
        type: String,
        default: "properties",
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    teamId: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    packageId: {
        type: Schema.Types.ObjectId,
        ref: "SubscriptionPackage",
        required: true
    },
    propertyName: {
        type: String,
        required: true
    },
    propertyType: {
        type: String,
        required: true
    },
    propertyCategory: {
        type: String,
        required: true
    },
    buildingName: {
        type: String,
        // required: true
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    postalCode: {
        type: Number,
    },
    propertyImage: {
        type: String,
    },
    propertyBlock: {
        type: Boolean,
    },
    createdOn: {
        type: Date,
        default: Date.now
    },



    //* jed suggestions
    propertyFeatures: [{
        type: String,
    }],
    // floorNumber: {
    //     type: String,
    //     default: 0
    // },
    // kitchen: {
    //     type: String,
    //     default: 0
    // },
    // pool: {
    //     type: String,
    //     default: 0
    // },
    // gym: {
    //     type: String,
    // },
    // fire: {
    //     type: String,
    // },
    // alarm: {
    //     type: String,
    // },
    // balcony: {
    //     type: String,
    // },
    // pet: {
    //     type: String,
    // },
    // storage: {
    //     type: String,
    // },
    // centerCooling: {
    //     type: String,
    // },
    // heating: {
    //     type: String,
    // },
    // laundry: {
    //     type: String,
    // },
    // dishWasher: {
    //     type: String,
    // },
    // barBeque: {
    //     type: String,
    // },
    // dryer: {
    //     type: String,
    // },
    // sauna: {
    //     type: String,
    // },
    // elevator: {
    //     type: String,
    // },
    // emergency: {
    //     type: String,
    // },
    // currency: {
    //     type: String,
    // },



    //* alvin asked for this
    Note: {
        type: String,
    },
    //* end
},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

propertySchema.pre(/^find/, function (next) {
    this.populate({
        path: 'userId',
        select: 'firstName lastName profilePic email phoneNumber companyName registrationNumber vatNumber street suburb city state country zip',
    })
        .populate({
            path: 'teamId',
            select: 'firstName lastName profilePic email phoneNumber companyName registrationNumber vatNumber street suburb city state country zip',
        })
    next();
});


const Properties = mongoose.model("Properties", propertySchema);

module.exports = Properties;