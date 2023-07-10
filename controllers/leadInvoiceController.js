
const leadInvoiceModel = require('../models/leadInvoiceModel');
const leadModel = require('../models/leadModel');
const invoiceSettingModel = require('../models/invoiceSettingModel');
const quotationModel = require('../models/quotationModel');
const catchAsync = require('../utils/catchAsync');
const { sendResponseResult } = require("../response/Response")
const { getAll, getOne, updateOne, deleteOne } = require('./handleFactory');
const { LeadInvoiceFunc, invoiceCancellationFunc } = require('../utils/verifyEmail');
const { extractIdFromAuthorizationHeader } = require('../token/tokenAndUserId');
const AppError = require('../utils/appError');

//* Create a leadInvoice 
exports.createLeadInvoice = catchAsync(async (req, res, next) => {
    const senderId = extractIdFromAuthorizationHeader(req.headers.authorization);

    let LeadDet = await leadModel.findOne({ _id: req.params.leadId });
    let invoiceSettingId = await invoiceSettingModel.findOne({ _id: req.params.settingId });
    let quotation = await quotationModel.findOne({ _id: req.params.quotationId });

    if (!LeadDet || !invoiceSettingId || !quotation) return next(new AppError('No document find with this ID', 400));

    const quotationInvoice = await leadInvoiceModel.countDocuments();
    const leadInvoiceNumber = "INV-" + (quotationInvoice + 1).toString().padStart(4, "0");

    const { dueDate } = req.body

    const newLeadInvoice = new leadInvoiceModel({
        userId: senderId,
        leadId: req.params.leadId,
        invoiceNumber: leadInvoiceNumber,
        numberOfUnits: quotation.numberOfUnits,
        numberOfUsers: quotation.numberOfUsers,
        discountPercentage: quotation.discountPercentage,
        totalAmount: quotation.totalAmount,
        vatPercentage: quotation.vatPercentage,
        numberOfUnitsAmount: quotation.numberOfUnitsAmount,
        numberOfUsersAmount: quotation.numberOfUsersAmount,
        maintenance: quotation.maintenance,
        security: quotation.security,
        assets: quotation.assets,
        fileManagement: quotation.fileManagement,
        bookings: quotation.bookings,
        facility: quotation.facility,
        dueDate,
        maintenancePrice: quotation.maintenancePrice,
        securityPrice: quotation.securityPrice,
        assetsPrice: quotation.assetsPrice,
        fileManagementPrice: quotation.fileManagementPrice,
        bookingsPrice: quotation.bookingsPrice,
        facilityPrice: quotation.facilityPrice,
        total_with_or_without_dis: quotation.total_with_or_without_dis,
        total_with_or_without_vat: quotation.total_with_or_without_vat,
        discountAmount: quotation.discountAmount,
        vatAmount: quotation.vatAmount

    });

    const savedLeadInvoice = await newLeadInvoice.save();
    const createdDate = savedLeadInvoice?.created_at?.toString().split("T")[0];

    if (savedLeadInvoice) {
        LeadInvoiceFunc(LeadDet, leadInvoiceNumber, invoiceSettingId, savedLeadInvoice, createdDate, dueDate, "Unpaid")
        await leadModel.findByIdAndUpdate(req.params.leadId, { invoiceStatus: true, invoiceId: savedLeadInvoice._id });
        await quotationModel.findByIdAndUpdate(req.params.quotationId, { invoiceStatus: true });
    }
    sendResponseResult(savedLeadInvoice, 201, res, req.baseUrl, false, req.method, false);
});

//* update quotation status and lead status
exports.updateInvoiceStatusById = catchAsync(async (req, res, next) => {

    const senderId = extractIdFromAuthorizationHeader(req.headers.authorization);
    const { reasonForCancelInvoice, invoiceStatus } = req.body;
    let leadInvoiceModelDet = await leadInvoiceModel.findOne({ _id: req.params.invoiceId });
    let leadDet = await leadModel.findOne({ _id: req.params.leadId });

    if (!leadInvoiceModelDet) {
        return next(new AppError('No document found with this ID', 400));
    }

    leadInvoiceModelDet.reasonForCancelInvoice = reasonForCancelInvoice;
    leadInvoiceModelDet.status = invoiceStatus;
    leadInvoiceModelDet.userWhoCancelInvId = senderId;
    const savedInvoice = await leadInvoiceModelDet.save();

    // await leadModel.findByIdAndUpdate(req.params.leadId, { status: leadStatus });
    if (savedInvoice) {
        invoiceCancellationFunc(leadInvoiceModelDet.invoiceNumber, leadDet.email, leadDet.firstName, leadDet.lastName)
    }

    sendResponseResult(savedInvoice, 200, res, req.baseUrl, false, req.method, false);
});



//* update quotation status and lead status
exports.updateInvoiceStatusToPaid = catchAsync(async (req, res, next) => {

    const senderId = extractIdFromAuthorizationHeader(req.headers.authorization);
    let LeadDet = await leadModel.findOne({ _id: req.params.leadId });
    let invoiceSettingId = await invoiceSettingModel.findOne({ _id: req.params.settingId });
    let leadInvoice = await leadInvoiceModel.findOne({ _id: req.params.invoiceId });

    if (!LeadDet || !invoiceSettingId || !leadInvoice) return next(new AppError('No document find with this ID', 400));

    const { invoiceStatus } = req.body

    leadInvoice.status = invoiceStatus;
    leadInvoice.userWhoChangeStatusToPaidInvoice = senderId;
    const savedInvoice = await leadInvoice.save();
    const updatedDate = savedInvoice?.updated_at?.toString().split("T")[0];


    if (savedInvoice) {
        LeadInvoiceFunc(LeadDet, leadInvoice.invoiceNumber, invoiceSettingId, leadInvoice, updatedDate, "", "Paid")
        // await quotationModel.findByIdAndUpdate(req.params.quotationId, { invoiceStatus: true });
    }

    sendResponseResult(savedInvoice, 201, res, req.baseUrl, false, req.method, false);
});

exports.getAllLeadInvoice = getAll(leadInvoiceModel); //* get all Leads invoice
exports.getLeadInvoiceById = getOne(leadInvoiceModel); //* get Leads invoice by id
exports.updateLeadInvoiceById = updateOne(leadInvoiceModel); //* update Leads invoice by id
exports.deleteLeadInvoice = deleteOne(leadInvoiceModel); //* delete a Leads invoice




