const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blockSchema = new Schema({
    object: {
        type: String,
        default: "blocks",
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
    blockName: {
        type: String,
        // required: true
    },
    blockNumber: {
        type: String,
        // required: true
    },
    blockAddress: {
        type: String,
        required: true
    },
    blockSize: {
        type: String,
        required: true,
    },
    numberOfUnits: {
        type: String,
        required: true,
    },
    //* gym , pool ect...
    Amenities: {
        type: String,
        // required: true,
    },
    maintenanceInformation: {
        type: Number,
    },
    TenantInformation: {
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

blockSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'userId',
        select: 'firstName lastName profilePic email phoneNumber companyName registrationNumber vatNumber street suburb city state country zip',
    })
    next();
});

blockSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'propertyId',
        select: 'propertyName propertyType buildingName address city country postalCode propertyImage propertyBlock',
    })
    next();
});

const Blocks = mongoose.model("Blocks", blockSchema);

module.exports = Blocks;