const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { getAll, getOne, deleteOne, getTeamByOwnerID } = require('./handleFactory');
const { Suspended, UnSuspended, SuspendAndUnSuspend } = require('../utils/verifyEmail');


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



exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.updateMe = catchAsync(async (req, res, next) => {

    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError('This route is not for password updates. Please use /updateMyPassword.', 400)
        );
    }

    const filteredBody = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        gender: req.body.gender,
        terms: req.body.terms,
        email: req.body.email,
        profilePic: req?.file?.filename,
        roles: req.body.roles,
        BuildingName: req.body.BuildingName,
        passportNumber: req.body.passportNumber,
        typeOfService: req.body.typeOfService,

        addressDetails: {
            street: req?.body?.street,
            suburb: req?.body?.suburb,
            city: req?.body?.city,
            state: req?.body?.state,
            country: req?.body?.country,
            zip: req?.body?.zip,
        },

        companyDetails: {
            companyName: req?.body?.companyName,
            tradingAs: req?.body?.tradingAs,
            vatRate: req?.body?.vatRate,
            vatNumber: req?.body?.vatNumber,
            registrationNumber: req?.body?.registrationNumber,
        },

        bankDetails: {
            bankName: req?.body?.bankName,
            branchName: req?.body?.branchName,
            swiftCode: req?.body?.swiftCode,
            accountNumber: req?.body?.accountNumber,
            accountType: req?.body?.accountType,
        }
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });
    sendResponseResult(updatedUser, 201, res, req.baseUrl, false, req.method, false);
});

exports.deactivateAccount = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(201).json({
        status: 'success',
        data: null
    });
});



exports.updateUserRole = catchAsync(async (req, res, next) => {
    const data = await User.findByIdAndUpdate(req.params.userId, { roles: req.body.roles }, { new: true, runValidators: true });
    if (!data) return next(new AppError("No user with this Id", 400));
    sendResponseResult(data, 201, res, req.baseUrl, false, req.method, false);
});


exports.susPendUser = catchAsync(async (req, res, next) => {
    const data = await User.findByIdAndUpdate(req.params.id, { status: false });

    if (!data) return next(new AppError("No user with this Id", 400));

    if (data) SuspendAndUnSuspend(data, "suspended");

    res.status(201).json({
        status: 'success',
        data: data
    });
});


exports.unSusPendUser = catchAsync(async (req, res, next) => {
    const data = await User.findByIdAndUpdate(req.params.id, { status: true });

    if (!data) return next(new AppError("No user with this Id", 400));

    if (data) SuspendAndUnSuspend(data, "unSuspended")

    res.status(201).json({
        status: 'success',
        data: data
    });
});

exports.propertyOwnerGetTenant = catchAsync(async (req, res, next) => {
    const getAllPropOwnerTenants = await User.find({
        propertyOwnerId: req.params.PropOwnerId,
        roles: { $in: ["tenant", "co_tenant", "guest_tenant"] },
    });
    sendResponseResult(getAllPropOwnerTenants, 201, res, req.baseUrl, false, req.method, false);
});


exports.adminGetallTenant = catchAsync(async (req, res, next) => {
    const getAllPropOwnerTenants = await User.find({
        roles: { $in: ["tenant", "co_tenant", "guest_tenant"] },
    });
    sendResponseResult(getAllPropOwnerTenants, 201, res, req.baseUrl, false, req.method, false);
});

exports.getAllUsers = getAll(User);
exports.getUser = getOne(User);
exports.getAllTeamsByTeamOwnerId = getTeamByOwnerID(User);
exports.deleteUser = deleteOne(User);










