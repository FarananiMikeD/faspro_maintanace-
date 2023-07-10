
const extraChargeModel = require('../models/extraChargeModel');
const catchAsync = require('../utils/catchAsync');
const { sendResponseResult } = require("../response/Response")
const { getAll, getOne, updateOne, deleteOne, getByPropID, getByUnitID } = require('./handleFactory');
const { extractIdFromAuthorizationHeader } = require('../token/tokenAndUserId');

//* Create a subscription 
exports.createExtraCharge = catchAsync(async (req, res, next) => {

    const senderId = extractIdFromAuthorizationHeader(req.headers.authorization);
    const { amount, type, frequency, termsAndConditions, startDate, endDate } = req.body;

    const newExtraCharge = new extraChargeModel({
        userId: senderId,
        propertyId: req.params.propertyId,
        unitId: req.params.unitId,
        amount,
        type,
        frequency,
        termsAndConditions,
        startDate,
        endDate
    });

    const savedExtraCharge = await newExtraCharge.save();

    sendResponseResult(savedExtraCharge, 201, res, req.baseUrl, false, req.method, false);
});

exports.getAllExtraCharges = getAll(extraChargeModel);
exports.getExtraChargeById = getOne(extraChargeModel);
exports.getExtraChargesByPropId = getByPropID(extraChargeModel);
exports.getExtraChargesByUnitId = getByUnitID(extraChargeModel);
exports.updateExtraChargeById = updateOne(extraChargeModel);
exports.deleteExtraCharge = deleteOne(extraChargeModel);




//* Get all extra changes for the current month (For the unit)
exports.getAllExtraChargesForCurrentMonthForUnit = catchAsync(async (req, res, next) => {
    const { monthDate } = req.query

    const parsedMonth = new Date(monthDate);
    const startOfMonth = new Date(parsedMonth.getFullYear(), parsedMonth.getMonth(), 1);
    const endOfMonth = new Date(parsedMonth.getFullYear(), parsedMonth.getMonth() + 1, 0);

    // Find all utilities charges for the current month
    const extraCharges = await extraChargeModel.find({
        createdOn: {
            $gte: startOfMonth,
            $lte: endOfMonth
        },
        unitId: req.params.unitId
    });

    // Calculate the total utility amount for this month
    const totalExtraCharges = extraCharges.reduce((total, charge) => { return total + charge.amount }, 0);

    return res.status(201).json({
        status: 'success',
        length: extraCharges?.length,
        object: 'list',
        has_more: false,
        data: extraCharges,
        totalExtraCharges,
        Url: req.baseUrl,
        method: `/${req.method}`,
    });
});


//* Get all extra charges for the current month (For the property)
exports.getAllExtraChargesForCurrentMonthForProperty = catchAsync(async (req, res, next) => {
    const { monthDate } = req.query

    const parsedMonth = new Date(monthDate);
    const startOfMonth = new Date(parsedMonth.getFullYear(), parsedMonth.getMonth(), 1);
    const endOfMonth = new Date(parsedMonth.getFullYear(), parsedMonth.getMonth() + 1, 0);


    // Find all utilities charges for the current month
    const extraCharges = await extraChargeModel.find({
        createdOn: {
            $gte: startOfMonth,
            $lte: endOfMonth
        },
        propertyId: req.params.propId
    });

    // Calculate the total utility amount for this month
    const totalExtraCharges = extraCharges.reduce((total, charge) => { return total + charge.amount }, 0);

    return res.status(201).json({
        status: 'success',
        length: extraCharges?.length,
        object: 'list',
        has_more: false,
        data: extraCharges,
        totalExtraCharges,
        Url: req.baseUrl,
        method: `/${req.method}`,
    });
});


exports.checkExtraChargeStatus = catchAsync(async (req, res, next) => {
    const extraCharges = await extraChargeModel.find({ unitId: req.params.unitId });
    for (let extraCharge of extraCharges) {
        if (extraCharge.endDate && extraCharge.endDate < new Date()) {
            extraCharge.status = 'inactive';
            await extraCharge.save();
        }
    }
    next();
});
