const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

//* chatGPT
// const nanoid = require('nanoid');
const zxcvbn = require('zxcvbn');


const array_role = [
    "tenant",

    //* tenant team
    "co_tenant",
    "visitor",

    //* A guest is a temporary tenant & can add his visitor on mobile
    "guest_tenant", //*  property owner add this user

    //* property users
    "property_owner_individual",
    "property_owner_agency",
    "property_owner_company",

    //*Teams
    "property_mgt_marketing",
    "property_mgt_sales",
    "property_mgt_finance",
    "property_mgt_maintenance",
    "property_mgt_leasing_officer",
    "service_provider",

    "portfolio_manager", //* property manager assistant
    "property_agency", //* property manager assistant

    //*security
    "security_manger",
    "security_worker",

    //* Admin
    "admin",
    "admin_assistant",
    "admin_marketing",
    "admin_sales",
    "admin_finance",
    "admin_support",
]


const companyDetailsSchema = new mongoose.Schema({
    companyName: {
        type: String,
    },
    tradingAs: {
        type: String,
    },
    vatRate: {
        type: Number,
    },
    vatNumber: {
        type: String,
    },
    registrationNumber: {
        type: String,
    },
});


const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        // required: true
    },
    suburb: {
        type: String,
        // required: true
    },
    city: {
        type: String,
        // required: true
    },
    state: {
        type: String,
        // required: true
    },
    country: {
        type: String,
        // required: true
    },
    zip: {
        type: String,
    },
});


const bankDetailsSchema = new mongoose.Schema({
    bankName: {
        type: String,
        // required: true
    },
    branchName: {
        type: String,
        // required: true
    },
    swiftCode: {
        type: String,
        // required: true
    },
    accountNumber: {
        type: String,
        // required: true
    },
    accountType: {
        type: String,
        // enum: ['Savings', 'Checking', ""],
        // default: "",
        // required: true
    },
});



const userSchema = new mongoose.Schema({
    object: {
        type: String,
        default: "users",
    },
    firstName: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: [true, 'Please provide your first name'],
        trim: true,
    },
    lastName: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: [true, 'Please provide your last name'],
        trim: true,
    },
    phoneNumber: {
        type: String,
        trim: true,
        // match: [/^\d{10}$/, '{VALUE} is not a valid phone number!'],
        // index: true,
        validate: {
            validator: function (v) {
                return /\d{10}/.test(v);
            },
            message: '{VALUE} is not a valid phone number!'
        }
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    BuildingName: {
        type: String,
    },
    passportNumber: {
        type: String,
    },
    terms: {
        type: Boolean,
    },
    typeOfService: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "is invalid"],
    },
    roles: {
        type: [String],
        enum: array_role,
        required: [true, 'The user role is required'],
        // default: "admin",
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 4,
        select: false,
        trim: true,
    },
    passwordConfirm: {
        type: String,
        //* I comment this out because of the middleware to change the tenant to false when the user has expired
        // required: [true, 'Please confirm your password'],
        trim: true,
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },

    profilePic: {
        type: String,
    },

    companyDetails: {
        type: companyDetailsSchema
    },

    //* User Address details
    addressDetails: {
        type: addressSchema
    },

    bankDetails: {
        type: bankDetailsSchema
    },

    // tenants: {
    //     type: [String]
    // },
    // teamId: {
    //     type: [String]
    // },

    //* Add the Id of the property owner when the property owner is adding a team member or adding an external user for specific module
    //* this should be used even for the portfolio manager or property agent
    propertyOwnerId: {
        type: String,
    },
    //* Add the Id of the security manager when the security manager is adding a security worker
    securityManagerId: {
        type: String,
    },
    //* Add the Id of the tenant when the tenant add a visitor or a co-tenant
    tenantId: { //* this id will be share by 3 users tenant co-tenant & guest-tenant
        type: String,
    },
    adminId: {
        type: String,
    },
    serviceProviderManagerId: {
        type: String,
    },
    property_id: {
        type: String,
    },
    invoice_Id: {
        type: Schema.Types.ObjectId,
        ref: "leadInvoices",
    },

    //* Add the Id the guest tenant when the guest tenant is adding a visitor 
    guestTenantId: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    status: {
        type: Boolean,
        default: true,
        select: true
    },
    license: {
        type: Boolean,
        default: false,
        // select: false
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    unitAccess: {
        type: String,
        enum: ["allowed", "expired"],
        default: "allowed"
    },
    passwordChangedAt: {
        type: Date,
        select: false,
    },
    passwordResetToken: {
        type: String,
        select: false,
    },
    passwordResetExpires: {
        type: Date,
        select: false,
    },
    otp: {
        type: Number,
        select: false
    },
    otpExpires: {
        type: Date,
        select: false
    },
    otpValidated: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);



userSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'invoice_Id',
        select: 'invoiceNumber numberOfUnits numberOfUsers numberOfUnitsAmount numberOfUsersAmount  discountPercentage vatPercentage maintenance security assets fileManagement bookings facility totalAmount ',
    });
    next();
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

//* the old method 
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    console.log({ resetToken }, this.passwordResetToken);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

//* new one from ChatGPT. it oes not work
// userSchema.methods.createPasswordResetToken = function () {
//     const resetToken = nanoid();
//     this.passwordResetToken = bcrypt.hashSync(resetToken, 10);
//     this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
//     return resetToken;
// };

//* new one from ChatGPT
userSchema.methods.passwordStrength = function () {
    const result = zxcvbn(this.password);
    return result.score;
};

const User = mongoose.model('User', userSchema);

module.exports = User;