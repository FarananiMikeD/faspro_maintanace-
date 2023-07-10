
const utilityModel = require('../models/utilityModel');
const catchAsync = require('../utils/catchAsync');
const { sendResponseResult } = require("../response/Response")
const { getAll, getOne, updateOne, deleteOne, getByPropID, getByUnitID } = require('./handleFactory');
const { extractIdFromAuthorizationHeader } = require('../token/tokenAndUserId');

//* Create a subscription 
exports.createUtility = catchAsync(async (req, res, next) => {

    const senderId = extractIdFromAuthorizationHeader(req.headers.authorization);
    const { utilityName, type, provider, meterNumber, rate, consumption, cost, billingPeriod, startDate, endDate } = req.body;

    const newUtility = new utilityModel({
        userId: senderId,
        propertyId: req.params.propertyId,
        unitId: req.params.unitId,
        utilityName,
        type,
        provider,
        meterNumber,
        startDate,
        endDate,
        rate,
        consumption,
        cost,
        billingPeriod
    });

    const savedUtility = await newUtility.save();

    sendResponseResult(savedUtility, 201, res, req.baseUrl, false, req.method, false);
});


exports.getAllUtilities = getAll(utilityModel);
exports.getUtilityById = getOne(utilityModel);
exports.getUtilitiesByPropId = getByPropID(utilityModel);
exports.getUtilitiesByUnitId = getByUnitID(utilityModel);
exports.updateUtilityById = updateOne(utilityModel);
exports.deleteUtility = deleteOne(utilityModel);


//* Get all utilities for the current month (For the unit)
exports.getAllUtilityForCurrentMonthForUnit = catchAsync(async (req, res, next) => {
    const { monthDate } = req.query

    const parsedMonth = new Date(monthDate);
    const startOfMonth = new Date(parsedMonth.getFullYear(), parsedMonth.getMonth(), 1);
    const endOfMonth = new Date(parsedMonth.getFullYear(), parsedMonth.getMonth() + 1, 0);

    // Find all utilities charges for the current month
    const utilityCharges = await utilityModel.find({
        createdOn: {
            $gte: startOfMonth,
            $lte: endOfMonth
        },
        unitId: req.params.unitId
    });

    // Calculate the total utility amount for this month
    const totalUtilityCharges = utilityCharges.reduce((total, charge) => { return total + charge.cost }, 0);

    return res.status(201).json({
        status: 'success',
        length: utilityCharges?.length,
        object: 'list',
        has_more: false,
        data: utilityCharges,
        totalUtilityCharges,
        Url: req.baseUrl,
        method: `/${req.method}`,
    });
});



//* Get all utilities for the current month (For the unit)
exports.getAllUtilityForCurrentMonthForProperty = catchAsync(async (req, res, next) => {
    const { monthDate } = req.query

    const parsedMonth = new Date(monthDate);
    const startOfMonth = new Date(parsedMonth.getFullYear(), parsedMonth.getMonth(), 1);
    const endOfMonth = new Date(parsedMonth.getFullYear(), parsedMonth.getMonth() + 1, 0);


    // Find all utilities charges for the current month
    const utilityCharges = await utilityModel.find({
        createdOn: {
            $gte: startOfMonth,
            $lte: endOfMonth
        },
        propertyId: req.params.propId
    });

    // Calculate the total utility amount for this month
    const totalUtilityCharges = utilityCharges.reduce((total, charge) => { return total + charge.cost }, 0);

    return res.status(201).json({
        status: 'success',
        length: utilityCharges?.length,
        object: 'list',
        has_more: false,
        data: utilityCharges,
        totalUtilityCharges,
        Url: req.baseUrl,
        method: `/${req.method}`,
    });
});


exports.checkUtilityStatus = catchAsync(async (req, res, next) => {
    const utilityCharges = await utilityModel.find({ unitId: req.params.unitId });
    for (let utilityCharge of utilityCharges) {
        if (utilityCharge.endDate && utilityCharge.endDate < new Date()) {
            utilityCharge.status = 'inactive';
            await utilityCharge.save();
        }
    }
    next();
});
