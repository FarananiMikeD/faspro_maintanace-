
const leadModel = require('../models/leadModel');
const catchAsync = require('../utils/catchAsync');
const { sendResponseResult } = require("../response/Response")
const { getAll, getOne, updateOne, deleteOne, getByPropID, getByUnitID } = require('./handleFactory');
// const { leadMessage, completeRegFunc } = require('../utils/verifyEmail');
const { leadMessage, completeRegFunc } = require('../utils/verifyEmail');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const { extractIdFromAuthorizationHeader } = require('../token/tokenAndUserId');


//* Create a lease 
exports.createLead = catchAsync(async (req, res, next) => {
    // const senderId = extractIdFromAuthorizationHeader(req.headers.authorization);
    const { email, companyName, phoneNumber, firstName, lastName, companySize, interestedModules, description, organizationType } = req.body;

    let user = await User.findOne({ email: email });
    if (user) return next(new AppError('User with given email already exist!', 400));

    const newLead = new leadModel({
        // userId: senderId,
        email,
        companyName,
        phoneNumber,
        firstName,
        lastName,
        organizationType,
        companySize,
        interestedModules,
        description
    });

    const savedLead = await newLead.save();
    if (savedLead) {
        leadMessage(email, phoneNumber, firstName, lastName, description)
        // LeadEmail(email, phoneNumber, firstName, lastName, description)
    }

    sendResponseResult(savedLead, 201, res, req.baseUrl, false, req.method, false);
});


exports.sendIndividualEmail = catchAsync(async (req, res, next) => {
    const leadDet = await leadModel.findOne({ _id: req.params.leadId });
    const invoiceId = leadDet.invoiceId

    if (!leadDet) {
        return next(new AppError('No document found with that ID', 404));
    } else {
        completeRegFunc(leadDet.email, leadDet._id, invoiceId, leadDet.firstName, leadDet.lastName, req.query.status)
    }
    sendResponseResult(leadDet, 200, res, req.baseUrl, false, req.method, false);
});




exports.updateLeadById = catchAsync(async (req, res, next) => {
    const senderId = extractIdFromAuthorizationHeader(req.headers.authorization);
    const { email, phoneNumber, firstName, lastName, companySize, companyName, interestedModules, description, status
    } = req.body;

    let leadDet = await leadModel.findOne({ _id: req.params.id });

    if (!leadDet) {
        return next(new AppError('No document found with that ID', 404));
    }

    leadDet.salesId = senderId;
    // leadDet.email = email;
    // leadDet.phoneNumber = phoneNumber;
    // leadDet.firstName = firstName;
    // leadDet.lastName = lastName;
    // leadDet.companySize = companySize;
    // leadDet.companyName = companyName;
    // leadDet.interestedModules = interestedModules;
    leadDet.description = description;
    leadDet.status = status;
    const savedLead = await leadDet.save();

    sendResponseResult(savedLead, 200, res, req.baseUrl, false, req.method, false);
});


exports.getAllLead = getAll(leadModel);
exports.getLeadById = getOne(leadModel);
exports.getLeadByPropId = getByPropID(leadModel);
exports.getLeadByUnitId = getByUnitID(leadModel);
// exports.updateLeadById = updateOne(leadModel);
exports.deleteLead = deleteOne(leadModel);