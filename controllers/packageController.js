
const userModelDb = require('../models/userModel');
const packageModelDb = require('../models/packageModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendResponseResult } = require("../response/Response")
const { getAll, getOne, updateOne, deleteOne, getTeamByOwnerID } = require('./handleFactory');
const { extractIdFromAuthorizationHeader } = require('../token/tokenAndUserId');
const { subscriptionPackageFunc } = require('../utils/verifyEmail');

//* Create a subscription 
exports.createSubscriptionPackage = catchAsync(async (req, res, next) => {
    const { name, price, numberOfUnits, numberOfUsers, duration, description, numberOfServiceProviders, numberOfSecurities, numberOfFAssets, numberOfFilesDocs, maintenance,
        security,
        assets,
        fileManagement,
        bookings,
        facility } = req.body;

    if (!name || !price || !numberOfUnits || !duration || !numberOfUsers) {
        return next(new AppError(`Please check your input carefully some of the field like  name, price, number of unit, duration are required`, 400));
    }

    const user = await userModelDb.findByIdAndUpdate(req.params.userId, { license: true }, { new: true });
    if (!user) {
        return next(new AppError(`User with ID ${req.params.userId} not found.`, 404));
    }

    const newSubscriptionPackage = new packageModelDb({
        userId: req.params.userId,
        name,
        price,
        numberOfUnits,
        numberOfUsers,
        duration,
        description,
        numberOfServiceProviders,
        numberOfSecurities,
        numberOfFAssets,
        numberOfFilesDocs,
        maintenance,
        security,
        assets,
        fileManagement,
        bookings,
        facility
    });

    const savedSubscriptionPackage = await newSubscriptionPackage.save();

    if (savedSubscriptionPackage) {
        subscriptionPackageFunc(user.email, user.firstName, user.lastName, savedSubscriptionPackage.duration)
    }
    sendResponseResult(savedSubscriptionPackage, 201, res, req.baseUrl, false, req.method, false);
});


//* This is a middleware that will verify if the user have bought a package or not
exports.packageMiddleware = catchAsync(async (req, res, next) => {

    const senderId = extractIdFromAuthorizationHeader(req.headers.authorization);
    const user_Id = await userModelDb.findOne({ _id: senderId })

    const userPackage = await packageModelDb.findOne({ userId: user_Id?.propertyOwnerId === undefined ? senderId : user_Id.propertyOwnerId });

    if (!userPackage || userPackage.subscriptionEnd <= Date.now()) {

        if (userPackage && userPackage.isActive) {
            userPackage.isActive = false;
            await userPackage.save();
        }

        return res.status(401).json({
            status: 'error',
            length: 0,
            object: 'not a list',
            has_more: false,
            data: "Your license has expired please contact the administrator or support team to assist you with your license",
            Url: req.baseUrl,
            method: `/${req.method}`,
        });
    }
    next();
});

exports.getAllPackages = getAll(packageModelDb);
exports.gePackageByPageId = getOne(packageModelDb);
exports.gePackageByUserId = getTeamByOwnerID(packageModelDb);
exports.updatePackageById = updateOne(packageModelDb);
exports.deletePackage = deleteOne(packageModelDb);




