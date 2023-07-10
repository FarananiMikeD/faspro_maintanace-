require("dotenv").config();
const crypto = require('crypto');
const { promisify } = require('util');
const User = require('./../models/userModel');
const unitModel = require('./../models/unitModel');
const propertyModel = require('./../models/propertyModel');
const leadInvoiceModel = require('./../models/leadInvoiceModel');
const Token = require('./../models/token');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { EmailVerify, forgetEmail, updatePasswordEmail, addTeamMemberEmailMessage, doneRegFunc, alertWrongRegistrationFunc, forgetEmailMobile } = require("../utils/verifyEmail");
const { validateRole, validateAdminRole, validateTeamRole } = require("./../roles/rolesCheck")

const jwt = require('jsonwebtoken');
/**
 * Create a JWT token with the given ID.
 *
 * @param {string} id - The ID to include in the token payload.
 * @returns {string} The signed JWT token.
 */
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

/**
 * Send a JSON response with the given data and metadata, including a signed JWT cookie.
 *
 * @param {object} data - The data to include in the response body.
 * @param {number} statusCode - The HTTP status code for the response.
 * @param {object} res - The Express response object to send the response through.
 * @param {string} baseUrl - The base URL for the API endpoint.
 * @param {boolean} object - Whether the data is an array (true) or a single object (false).
 * @param {string} method - The HTTP method used to access the endpoint.
 * @param {boolean} has_more - Whether there are more results available than were included in this response.
 */
const sendResponseResult = (data, statusCode, res, baseUrl, object, method, has_more) => {
    // Create and send a signed JWT cookie.
    const token = signToken(data._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }
    res.cookie('jwt', token, cookieOptions);

    // Remove the password field from the response data before sending it.
    data.password = undefined;

    // Send the response with the appropriate metadata.
    res.status(statusCode).json({
        status: 'success',
        token,
        length: data?.length,
        object: object ? 'list' : 'not a list',
        has_more: has_more,
        data,
        Url: baseUrl,
        method: `/${method}`,
    });
};




//* PROTECT THE USER NOT TO RESET HIS FORGOTTEN PASSWORD IF HE/SHE HASN'T LOGIN
exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }

    req.user = currentUser;
    next();
});




//* REGISTER AS A PROPERTY OWNER 
exports.propertyOwnersRegister = catchAsync(async (req, res, next) => {

    //* Validate the role
    validateRole(req, next);
    const invoice = await leadInvoiceModel.findOne({ _id: req.body.invoiceId });

    if (!invoice) {
        alertWrongRegistrationFunc(req.body.email, req.body.firstName, req.body.lastName, req.body.phoneNumber)
        return next(new AppError(`Invoice with ID ${req.body.invoiceId} does not exists`, 404));
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) return next(new AppError('User with given email already exist!', 400));

    const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        gender: req.body.gender,
        terms: req.body.terms,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        profilePic: req?.file?.filename,
        roles: req.body.roles,
        BuildingName: req.body.BuildingName,
        passportNumber: req.body.passportNumber,
        verified: true,
        invoice_Id: req.body.invoiceId,

        addressDetails: {
            street: req.body.street,
            suburb: req.body.suburb,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            zip: req.body.zip,
        },

        companyDetails: {
            companyName: req.body.companyName,
            tradingAs: req.body.tradingAs,
            vatRate: req.body.vatRate,
            vatNumber: req.body.vatNumber,
            registrationNumber: req.body.registrationNumber,
        },

        bankDetails: {
            bankName: req.body.bankName,
            branchName: req.body.branchName,
            swiftCode: req.body.swiftCode,
            accountNumber: req.body.accountNumber,
            accountType: req.body.accountType,
        }
    })


    // ! THIS IS FOR THE VERIFICATION EMAIL I REMOVE IT FOR NOW
    // let token = await Token.create({
    //     userId: newUser._id,
    //     token: crypto.randomBytes(32).toString("hex"),
    // });

    // const verifyURL = `${process.env.FRONT_END_URL}verify/${newUser._id}/${token.token}`;
    // if (verifyURL) EmailVerify(verifyURL, newUser);
    //! END

    if (newUser) doneRegFunc(req.body.firstName, req.body.lastName);

    sendResponseResult(newUser, 201, res, req.baseUrl, false, req.method, false);
});





//* PROPERTY OWNER (add team member)
exports.propertyOwnersRegisterTeamMember = catchAsync(async (req, res, next) => {
    validateTeamRole(req, next);

    let user = await User.findOne({ email: req.body.email });
    if (user) return next(new AppError('User with given email already exist!', 400));
    const passwordGenerator = crypto.randomBytes(4).toString("hex")

    console.log("passwordGenerator : ", passwordGenerator)

    const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        gender: req.body.gender,
        terms: true,
        verified: true,
        license: true,
        email: req.body.email,
        password: passwordGenerator,
        passwordConfirm: passwordGenerator,
        roles: req.body.roles,

        propertyOwnerId: req?.params?.propOwnerId,
        tenantId: req?.params?.tenantId,
        serviceProviderManagerId: req?.params?.serviceProId,
        securityManagerId: req?.params?.securityId,

        bankDetails: {
            bankName: req?.body?.bankName,
            branchName: req?.body?.branchName,
            swiftCode: req?.body?.swiftCode,
            accountNumber: req?.body?.accountNumber,
            accountType: req?.body?.accountType,
        }
    })

    if (req?.body?.unitId) {
        const unit = await unitModel.findOne({ _id: req?.body?.unitId });
        if (!unit) {
            const message = "Unit not found"
            return res.status(400).json({
                status: 'fail',
                object: 'not a list',
                has_more: false,
                message,
                Url: req.baseUrl,
                method: req.method,
            });
        } else {
            unit.tenants.push(newUser._id);
            await unit.save();
        }
    }

    if (req?.body?.property_id && Array.isArray(req.body.property_id)) {
        const propertyIds = req.body.property_id;
        propertyIds.forEach(async (propertyId) => {
            const property = await propertyModel.findOne({ _id: propertyId });
            if (!property) {
                const message = `Property with ID ${propertyId} not found`;
                return res.status(400).json({
                    status: 'fail',
                    object: 'not a list',
                    has_more: false,
                    message,
                    Url: req.baseUrl,
                    method: req.method,
                });
            } else {
                property.teamId.push(newUser._id);
                await property.save();
            }
        });
    }

    if (newUser) addTeamMemberEmailMessage(newUser, passwordGenerator)

    sendResponseResult(newUser, 201, res, req.baseUrl, false, req.method, false);
});



//* REGISTER AS AN ADMIN
exports.adminRegister = catchAsync(async (req, res, next) => {

    validateAdminRole(req, next);

    let user = await User.findOne({ email: req.body.email });
    if (user) return next(new AppError('User with given email already exist!', 400));

    const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        terms: true,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        profilePic: req?.file?.filename,
        roles: req.body.roles,
        verified: true,
        license: true,
    })

    sendResponseResult(newUser, 201, res, req.baseUrl, false, req.method, false);
});



//* REGISTER AS AN ADMIN
exports.teamAdmin = catchAsync(async (req, res, next) => {

    validateAdminRole(req, next);

    let user = await User.findOne({ email: req.body.email });
    if (user) return next(new AppError('User with given email already exist!', 400));
    const passwordGenerator = crypto.randomBytes(4).toString("hex")

    const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        terms: true,
        verified: true,
        email: req.body.email,
        password: passwordGenerator,
        passwordConfirm: passwordGenerator,
        roles: req.body.roles,
        adminId: req.params.adminId,
    })

    if (newUser) addTeamMemberEmailMessage(newUser, passwordGenerator)

    sendResponseResult(newUser, 201, res, req.baseUrl, false, req.method, false);
});



//* VERIFY TOKEN 
exports.verify = catchAsync(async (req, res, next) => {

    const user = await User.findOne({ _id: req.params.id });
    if (!user) return next(new AppError("Invalid user ID", 400));

    // const token = await Token.findOne({ userId: user._id, myToken: req.params.token });
    const token = await Token.findOneAndDelete({ userId: user._id, myToken: req.params.token });
    if (!token) return next(new AppError("Invalid link", 400));

    const filter = { _id: user._id }
    const updateDocument = { $set: { verified: true } }

    await User.updateOne(filter, updateDocument);
    await Token.findByIdAndRemove(token._id);

    const newUser = await User.findOne({ _id: req.params.id });

    if (!newUser.verified) return next(new AppError("You did not verify your email", 400));

    sendResponseResult(newUser, 201, res, req.baseUrl, false, req.method, false);
});


//* LOGIN
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    if (!user.verified) {
        return next(new AppError('Please Verify your email then try again', 401));
    }
    if (!user.status) {
        return next(new AppError('You have been suspended', 401));
    }
    if (!user.license) {
        return next(new AppError('You do not have a license yet please contact the admin to find more about that', 401));
    }
    sendResponseResult(user, 200, res, req.baseUrl, false, req.method, false);
});


//*LOGOUT
exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};


//* FORGOT PASSWORD 
exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(new AppError('There is no user with this email address.', 404));

    const allowedAdminRoles = [
        "admin",
        "admin_assistant",
        "admin_marketing",
        "admin_sales",
        "admin_finance",
        "admin_support",
    ];

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
        // If some role in user.roles is included in allowedAdminRoles, it means the user has an admin role
        if (user.roles.some(role => allowedAdminRoles.includes(role))) {
            const resetURL = `https://admin.faspro24.com/resetPassword/${resetToken}`;
            forgetEmail(resetURL, user)
        } else {
            const resetURL = `${process.env.FRONT_END_URL}resetPassword/${resetToken}`;
            forgetEmail(resetURL, user)
        }
        sendResponseResult(user, 201, res, req.baseUrl, false, req.method, false);
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        if (err.code === 'ENOTFOUND') {
            return next(new AppError('There was a problem connecting to the email server. Please check your network connection and try again later.', 502));
        }
        return next(new AppError('There was an error sending the email. Try again later!', 500));
    }
});



//* RESET PASSWORD
exports.resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    if (!user) return next(new AppError('Token is invalid or has expired', 400));
    if (user) updatePasswordEmail(user, "You have successfully reset your password !!")

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;


    if (!user.password || !user.passwordConfirm) {
        return next(new AppError('Please provide a password and password confirmation', 400));
    }

    if (user.password !== user.passwordConfirm) {
        return next(new AppError('Passwords do not match', 400));
    }


    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    sendResponseResult(user, 201, res, req.baseUrl, false, req.method, false);
})





//* FORGOT PASSWORD FOR MOBILE APPLICATION
exports.forgotPasswordMobile = catchAsync(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email }).select('+otp +otpExpires');
    if (!user) return next(new AppError('There is no user with this email address.', 404));

    // Generate a random OTP
    const otp = Math.floor(100000 + Math.random() * 900000);  // generate 6 digit number

    // Save the OTP and expiry time in the database
    user.otp = otp;
    user.otpExpires = Date.now() + 30 * 60 * 1000;  // OTP expires after 10 minutes
    await user.save({ validateBeforeSave: false });

    try {
        // Send the OTP to the user's email
        const otpEmailMessage = `Your OTP for password reset is ${otp}. It will expire in 30 minutes.`;
        // Here you can call the function to send the email, something like this:
        await forgetEmailMobile(otpEmailMessage, user);
    } catch (err) {
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Try again later!', 500));
    }

    const message = 'Password reset successful!'
    sendResponseResult(message, 201, res, req.baseUrl, false, req.method, false);
});

//* VERIFY OTP CODE
exports.verifyOtp = catchAsync(async (req, res, next) => {
    // Get user based on the POSTed email
    const user = await User.findOne({ email: req.body.email }).select('+otp +otpExpires');

    if (!user) {
        return next(new AppError('There is no user with this email address.', 404));
    }

    // Check if OTP matches and hasn't expired
    if (user.otp !== req.body.otp || user.otpExpires <= Date.now()) {
        return next(new AppError('Invalid or expired OTP.', 400));
    }

    // if (user.otpValidated === true) {
    //     return next(new AppError('OTP has already been verified.', 400));
    // }

    user.otpValidated = true;
    await user.save({ validateBeforeSave: false });

    const message = 'OTP verified successfully. Please proceed to reset password.'
    sendResponseResult(message, 200, res, req.baseUrl, false, req.method, false);
});


//* Reset Password for the mobile application
exports.resetPasswordMobile = catchAsync(async (req, res, next) => {
    // Get user based on the email
    const user = await User.findOne({ email: req.body.email }).select('+otp +otpExpires');

    if (!user) return next(new AppError('There is no user with this email address.', 404));

    if (!user.otpValidated) {
        return next(new AppError('Your password has already been reset. If you have forgotten your password, please request a new password reset.', 403));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    if (!user.password || !user.passwordConfirm) {
        return next(new AppError('Please provide a password and password confirmation', 400));
    }

    if (user.password !== user.passwordConfirm) {
        return next(new AppError('Passwords do not match', 400));
    }

    // Remove the OTP and expiry time from the user's document in the database
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpValidated = false;
    await user.save();

    const message = 'Password reset successful!'
    sendResponseResult(message, 200, res, req.baseUrl, false, req.method, false);
});



//* UPDATE PASSWORD WHILST YOU ARE INSIDE OF THE SYSTEM (UNDER YOUR ACCOUNT)
exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong.', 401));
    }

    try {
        await updatePasswordEmail(user, "You have successfully updated your password !!")
    } catch (err) {
        return next(new AppError('There was an error sending the email. Try again later!'), 500);
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    sendResponseResult(user, 201, res, req.baseUrl, false, req.method, false);
});


//* GRANT THE USER ACCESS TO CERTAIN API IF HE HAS THIS TYPE OF ROLE
exports.restrictTo = (...rolesApi) => {
    return (req, res, next) => {
        let userRole;

        if (req.user && req.user.roles) {
            userRole = req.user.roles;
        } else if (req.body && req.body.roles) {
            userRole = req.body.roles;
        } else {
            // Handle the case when the role is not present
            return next(new AppError('Role not found', 400));
        }

        let isFound = rolesApi.some(role => {
            return userRole.includes(role);
        });

        if (!isFound) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }

        next();
    };
};



// exports.restrictTo = (...rolesApi) => {
//     return (req, res, next) => {
//         const arr_role = req.user.roles
//         let isFound = rolesApi.some(role => arr_role.includes(role))
//         if (!isFound) {
//             return next(new AppError('You do not have permission to perform this action', 403));
//         }
//         next();
//     };
// };

