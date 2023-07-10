const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//* Apartment, Duplex, single family homes

const unitSchema = new Schema({
    object: {
        type: String,
        default: "units",
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
    blockId: {
        type: Schema.Types.ObjectId,
        ref: "Blocks",
    },
    tenants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    unitName: {
        type: String,
    },
    unitNumber: {
        type: String,
    },
    unitOwnerName: {
        type: String,
    },
    numberOfBedrooms: {
        type: String,
        default: 0
    },
    numberOfBathRooms: {
        type: String,
        default: 0
    },
    //* jed suggestions
    bookableField: {
        type: String,
    },
    floorNumber: {
        type: String,
        default: 0
    },
    kitchen: {
        type: String,
        default: 0
    },
    pool: {
        type: String,
        default: 0
    },
    gym: {
        type: String,
    },
    fire: {
        type: String,
    },
    alarm: {
        type: String,
    },
    balcony: {
        type: String,
    },
    pet: {
        type: String,
    },
    storage: {
        type: String,
    },
    centerCooling: {
        type: String,
    },
    heating: {
        type: String,
    },
    laundry: {
        type: String,
    },
    dishWasher: {
        type: String,
    },
    barBeque: {
        type: String,
    },
    dryer: {
        type: String,
    },
    sauna: {
        type: String,
    },
    elevator: {
        type: String,
    },
    emergency: {
        type: String,
    },
    //* end
    unitType: {
        type: String,
    },
    RentAmount: {
        type: Number,
        required: true,
    },
    parkingGarage: {
        type: String,
    },
    floorNumber: {
        type: Number,
    },
    // This includes any special features of the unit such as a balcony, a fireplace, or a view.
    Amenities: {
        type: Number,
    },
    surfaceArea: {
        type: String,
        required: true,
    },
    // This is a brief summary of the features and amenities that the unit has to offer.
    Description: {
        type: String,
    },
    // This is the length of time that the tenant will be required to rent the unit.
    leaseTerm: {
        type: String,
        required: true,
    },

    numberOfLivingRoom: {
        type: String,
    },
    numberOfBalcony: {
        type: String,
    },
    numberOfFloor: {
        type: String,
    },

    createdOn: {
        type: Date,
        default: Date.now
    },


    //! VOCATION & INCLUDE EVERYTHING ABOVE
    // This includes the daily or weekly rental rates for the unit.
    rentalRates: {
        type: String,
    },
    maximumOccupancy: {
        type: String,
    },
    Location: {
        // This includes information about the location of the vacation home property such as the address, nearby attractions, and distance to the beach, shopping, and restaurants.
        type: String,
    },
    // This includes information about the deposit required to reserve the unit and the cancellation policy in case the renter needs to cancel their reservation.
    deposit_and_CancellationPolicy: {
        type: String,
    },

    //! CONDOMINIUMS & INCLUDE EVERYTHING ABOVE
    CondoAssociationFees: {
        type: String,
    },
    petPolicy: {
        type: String,
    },
    // This includes the estimated annual property taxes for the unit.
    propertyTaxes: {
        type: String,
    },


    //! OFFICES
    //* remove the bathroom, bedroom



    //! WAREHOUSE
    // f the property represents a physical object stored in the warehouse, such as a piece of lumber or steel, you might collect a length unit such as meters, centimeters, or feet.
    length: {
        type: String,
    },

    // If the property represents a bulk material, such as sand or gravel, you might collect a weight unit such as kilograms or pounds.
    weight: {
        type: String,
    },

    // If the property represents a liquid or gas stored in a container, such as a drum or tank, you might collect a volume unit such as liters or gallons.
    volume: {
        type: String,
    },

    //  If the property represents a discrete item, such as a box of widgets, you might collect a quantity unit such as units or pieces.
    quantity: {
        type: String,
    },
    // Width: meters, feet, inches, etc.
    width: {
        type: String,
    },

    // Temperature: Celsius, Fahrenheit, etc.
    temperature: {
        type: String,
    },


    //! HOTELS & RESTAURANT
    // include the room number

    //  If you are adding a restaurant table as a unit, you may want to collect the table number.
    tableNumber: {
        type: String,
    },
    // You may want to track the availability of the unit, including the dates and times it is available for use.
    availability: {
        type: String,
    },


    //! SHOPPING MALLS
    // include the room number

    //  If you are adding a retail store as a unit, you may want to collect the store number.
    storeNumber: {
        type: String,
    },
    // Depending on the unit type, you may want to collect information about how many people can occupy the unit at once.
    occupancy: {
        type: String,
    },
    // You may want to track the availability of the unit, including the dates and times it is available for use.
    availability: {
        type: String,
    },
    // You may want to categorize the unit based on the type of business it is, such as clothing store, electronics store, food court, etc.
    category: {
        type: String,
    },
    // You may want to collect the name and contact information of the business owner who is leasing the unit.
    businessOwner: {
        type: String,
    },


    //! INDUSTRIAL  BUILDING
    //  You can collect information about the area of the unit, including the total area, the built-up area, and the carpet area.
    area: {
        type: String,
    },
    // If the unit is a warehouse or a manufacturing unit, you may want to collect information about the ceiling height.
    ceilingHeight: {
        type: String,
    },
    // Depending on the type of unit, you may want to collect information about the power supply, including the maximum load that the unit can handle.
    powerSupply: {
        type: String,
    },
    //  You may want to collect information about the security arrangements for the unit, such as access control, CCTV cameras, and security guards.
    Security: {
        type: String,
    },



},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

unitSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'userId',
        select: 'firstName lastName profilePic email phoneNumber companyName registrationNumber vatNumber street suburb city state country zip',
    })
        .populate({
            path: 'tenants',
            select: 'firstName lastName profilePic email phoneNumber companyName registrationNumber vatNumber street suburb city state country zip',
        })
        .populate({
            path: 'propertyId',
            select: 'propertyName propertyType buildingName address city country postalCode propertyImage propertyBlock',
        })
        .populate({
            path: 'blockId',
            select: 'blockName blockNumber blockAddress blockSize numberOfUnits Amenities maintenanceInformation TenantInformation',
        })
    next();
});


const Units = mongoose.model("Units", unitSchema);

module.exports = Units;