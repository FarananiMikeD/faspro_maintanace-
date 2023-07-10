
const leaseModel = require('../models/leaseModel');
const userModel = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const { sendResponseResult } = require("../response/Response")
const { getAll, getOne, updateOne, deleteOne, getByPropID, getByUnitID } = require('./handleFactory');
const { extractIdFromAuthorizationHeader } = require('../token/tokenAndUserId');
const AppError = require('../utils/appError');

exports.checkLeaseEndDate = catchAsync(async (req, res, next) => {
    const leaseId = req.params.id;
    // Get the lease details from the database
    const lease = await leaseModel.findById(leaseId);

    if (!lease) {
        return res.status(404).json({
            status: 'fail',
            message: 'Lease not found',
            Url: req.baseUrl,
            method: req.method,
        });
    }

    const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in ISO string format
    const endDate = lease.endDate.toISOString().split('T')[0]

    if (currentDate > endDate) { // Check if lease endDate is equal to the current date
        lease.status = 'inactive';
        await lease.save();

        const tenantIds = lease?.propertyId?.teamId; // Get the tenant IDs from the lease
        for (const tenantId of tenantIds) {
            const tenant = await userModel.findById(tenantId); // Find the tenant by ID

            if (tenant) { // Update the tenant status
                tenant.status = false;
                await tenant.save();
            }
        }

        return res.status(404).json({
            status: 'success',
            length: 0,
            object: "not a list",
            message: 'The lease has expired, it need to be renewed',
            data: null,
            has_more: "false",
            Url: req.baseUrl,
            method: req.method,
        });
    }
    next();
});



//* Create a lease 
exports.createLease = catchAsync(async (req, res, next) => {

    const senderId = extractIdFromAuthorizationHeader(req.headers.authorization);
    const { rentDeposit, rentAmount, latePaymentPercentage, gracePeriod, startDate, endDate, paymentDueDate } = req.body;

    const newLease = new leaseModel({
        userId: senderId,
        propertyId: req.params.propertyId,
        unitId: req.params.unitId,
        rentDeposit,
        rentAmount,
        latePaymentPercentage,
        gracePeriod,
        startDate,
        endDate,
        paymentDueDate,
        leaseAgreement: req?.file?.filename
    });

    const savedLease = await newLease.save();

    sendResponseResult(savedLease, 201, res, req.baseUrl, false, req.method, false);
});

exports.getAllLeases = getAll(leaseModel);
exports.getLeaseById = getOne(leaseModel);
exports.getLeasesByPropId = getByPropID(leaseModel);
exports.getLeasesByUnitId = getByUnitID(leaseModel);
exports.updateLeaseById = updateOne(leaseModel);
exports.deleteLease = deleteOne(leaseModel);