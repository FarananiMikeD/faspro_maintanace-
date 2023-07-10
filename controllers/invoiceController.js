
const leaseModel = require('../models/leaseModel');
const invoiceModel = require('../models/invoiceModel');
const unitModel = require('../models/unitModel');
const extraChargeModel = require('../models/extraChargeModel');
const utilityModel = require('../models/utilityModel');
const catchAsync = require('../utils/catchAsync');
const { sendResponseResult } = require("../response/Response")
const { getAll, getOne, updateOne, deleteOne, getByPropID, getByUnitID } = require('./handleFactory');
const { extractIdFromAuthorizationHeader } = require('../token/tokenAndUserId');
const AppError = require('../utils/appError');



//* Create a subscription 
exports.createInvoice = catchAsync(async (req, res, next) => {

    const senderId = extractIdFromAuthorizationHeader(req.headers.authorization);
    const unit = await unitModel.findById(req.params.unitId);

    if (!unit) return next(new AppError('No document find with this ID', 400));

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Find all extra charges for the current month
    const extraCharges = await extraChargeModel.find({
        status: "active",
        unitId: req.params.unitId
        // createdOn: {
        //     $gte: startOfMonth,
        //     $lte: endOfMonth
        // },
    });

    // Calculate the total extra charge amount for this month
    const totalExtraCharges = extraCharges.reduce((total, charge) => {
        return total + charge.amount;
    }, 0);

    // Find all utilities charges for the current month
    const utilityCharges = await utilityModel.find({
        status: "active",
        unitId: req.params.unitId
        // createdOn: {
        //     $gte: startOfMonth,
        //     $lte: endOfMonth
        // },
    });

    // Calculate the total utility amount for this month
    const totalUtilityCharges = utilityCharges.reduce((total, charge) => {
        return total + charge.cost;
    }, 0);

    const totalAmount = unit.RentAmount + totalUtilityCharges + totalExtraCharges;

    const countInvoices = await invoiceModel.countDocuments();
    const invoiceNumber = "INV-" + (countInvoices + 1).toString().padStart(3, "0");

    const newInvoice = new invoiceModel({
        invoiceNumber: invoiceNumber,
        userId: senderId,
        propertyId: req.params.propertyId,
        unitId: req.params.unitId,
        rentalAmount: unit.RentAmount,
        utilityCharges: totalExtraCharges,
        extraCharges: totalUtilityCharges,
        totalAmount,
    });

    const savedInvoice = await newInvoice.save();

    sendResponseResult(savedInvoice, 201, res, req.baseUrl, false, req.method, false);
});

exports.getAllInvoices = getAll(invoiceModel);
exports.getInvoiceById = getOne(invoiceModel);
exports.getInvoicesByPropId = getByPropID(invoiceModel);
exports.getInvoicesByUnitId = getByUnitID(invoiceModel);
exports.deleteInvoice = deleteOne(invoiceModel);

// exports.updateInvoiceById = updateOne(invoiceModel);
exports.updateInvoiceById = catchAsync(async (req, res, next) => {
    const invId = req.params.id;
    const { status } = req.body;

    const newInvoice = await invoiceModel.findById(invId);
    if (!newInvoice) return next(new AppError('No document found with that ID', 404));

    newInvoice.status = status;
    await newInvoice.save();
    sendResponseResult(newInvoice, 200, res, req.baseUrl, true, req.method, false);
})

exports.checkIfInvoiceOverdue = catchAsync(async (req, res, next) => {

    const unitId = req.params.unitId;
    const lease = await leaseModel.find({ unitId: unitId });
    const paymentDueDate = new Date(lease[0]?.paymentDueDate);
    const gracePeriod = lease[0]?.gracePeriod;

    // Calculate the due date for the current month's invoice
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const dueDate = new Date(currentYear, currentMonth, paymentDueDate.getDate());

    if (dueDate < today) {
        dueDate.setMonth(currentMonth + 1);
    }

    // Calculate the grace period end date for the current month's invoice
    const endDueDate = new Date(dueDate);

    endDueDate.setDate(endDueDate.getDate() + gracePeriod);
    // Find all unpaid invoices for the current month
    const invoices = await invoiceModel.find({
        status: 'pending',
        createdOn: {
            $gte: dueDate,
            $lte: endDueDate
        },
        unitId: unitId
    });

    // Update the status of any unpaid invoices to 'overdue'
    if (invoices.length > 0) {
        await invoiceModel.updateMany({
            _id: { $in: invoices.map(i => i._id) }
        }, {
            $set: { status: 'overdue' }
        });
    }

    next();
});
