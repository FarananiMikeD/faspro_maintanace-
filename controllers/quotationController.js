
const quotationModel = require('../models/quotationModel');
const leadModel = require('../models/leadModel');
const invoiceSettingModel = require('../models/invoiceSettingModel');
const catchAsync = require('../utils/catchAsync');
const { sendResponseResult } = require("../response/Response")
const { getAll, getOne, deleteOne } = require('./handleFactory');
const { QuotationFunc } = require('../utils/verifyEmail');
const { extractIdFromAuthorizationHeader } = require('../token/tokenAndUserId');
const AppError = require('../utils/appError');


//* Create a quotation 
exports.createQuotation = catchAsync(async (req, res, next) => {

    const senderId = extractIdFromAuthorizationHeader(req.headers.authorization);
    const { numberOfUnits, numberOfUsers, discountPercentage, totalAmount, modules, numberOfUnitsAmount, numberOfUsersAmount, vatPercentage, dueDate, maintenance,
        security,
        assets,
        fileManagement,
        bookings,
        facility,
        maintenancePrice,
        securityPrice,
        assetsPrice,
        fileManagementPrice,
        bookingsPrice,
        facilityPrice,

    } = req.body;

    let quotation = await leadModel.findOne({ _id: req.params.leadId });
    let invoiceSettingId = await invoiceSettingModel.findOne({ _id: req.params.settingId });

    if (!quotation || !invoiceSettingId) return next(new AppError('No document find with this ID', 400));

    const quotationCount = await quotationModel.countDocuments();
    const quotationNumber = "QUO-" + (quotationCount + 1).toString().padStart(4, "0");

    // Calculate the total amount with or without discount
    const total_with_or_without_dis = discountPercentage
        ? totalAmount - (totalAmount * discountPercentage) / 100
        : totalAmount;

    // Calculate the total amount with or without VAT
    const total_with_or_without_vat = vatPercentage
        ? total_with_or_without_dis + (total_with_or_without_dis * vatPercentage) / 100
        : total_with_or_without_dis;

    const discountAmount = (totalAmount * discountPercentage) / 100;
    const vatAmount = (total_with_or_without_dis * vatPercentage) / 100;

    const newQuotation = new quotationModel({
        userId: senderId,
        leadId: req.params.leadId,
        quotationNumber,
        numberOfUnits,
        numberOfUsers,
        discountPercentage,
        totalAmount,
        modules,
        vatPercentage,
        numberOfUnitsAmount,
        numberOfUsersAmount,
        dueDate,
        maintenance,
        security,
        assets,
        fileManagement,
        bookings,
        facility,
        maintenancePrice,
        securityPrice,
        assetsPrice,
        fileManagementPrice,
        bookingsPrice,
        facilityPrice,
        total_with_or_without_dis: total_with_or_without_dis.toFixed(2),
        total_with_or_without_vat: total_with_or_without_vat.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
        vatAmount: vatAmount.toFixed(2),
    });

    const savedQuotation = await newQuotation.save();
    const createdDate = savedQuotation?.created_at?.toString().split("T")[0];

    if (savedQuotation) {
        QuotationFunc(quotation, quotationNumber, invoiceSettingId, savedQuotation, createdDate, dueDate)
        await leadModel.findByIdAndUpdate(req.params.leadId, { salesId: senderId, quotationStatus: true, status: "waiting" });
    }
    sendResponseResult(savedQuotation, 201, res, req.baseUrl, false, req.method, false);
});



//* update quotation
exports.updateQuotationById = catchAsync(async (req, res, next) => {
    const senderId = extractIdFromAuthorizationHeader(req.headers.authorization);
    const { numberOfUnits, numberOfUsers, discountPercentage, totalAmount, modules, numberOfUnitsAmount, numberOfUsersAmount, vatPercentage, dueDate, maintenance,
        security,
        assets,
        fileManagement,
        bookings,
        facility,
        maintenancePrice,
        securityPrice,
        assetsPrice,
        fileManagementPrice,
        bookingsPrice,
        facilityPrice,
    } = req.body;

    let quotation = await quotationModel.findOne({ _id: req.params.quoteId });
    let leadDetails = await leadModel.findOne({ _id: req.params.leadId });
    let invoiceSettingId = await invoiceSettingModel.findOne({ _id: req.params.settingId });

    if (!quotation || !leadDetails || !invoiceSettingId) {
        return next(new AppError('No document found with this ID', 400));
    }

    // Calculate the total amount with or without discount
    const total_with_or_without_dis = discountPercentage ? totalAmount - (totalAmount * discountPercentage) / 100 : totalAmount;

    // Calculate the total amount with or without VAT
    const total_with_or_without_vat = vatPercentage ? total_with_or_without_dis + (total_with_or_without_dis * vatPercentage) / 100 : total_with_or_without_dis;

    const discountPercentageAmt = (totalAmount * discountPercentage) / 100;
    const vatPercentageAmt = (total_with_or_without_dis * vatPercentage) / 100;

    quotation.userId = senderId;
    quotation.numberOfUnits = numberOfUnits;
    quotation.numberOfUsers = numberOfUsers;
    quotation.discountPercentage = discountPercentage;
    quotation.totalAmount = totalAmount;
    quotation.vatPercentage = vatPercentage;
    quotation.numberOfUnitsAmount = numberOfUnitsAmount;
    quotation.numberOfUsersAmount = numberOfUsersAmount;
    quotation.dueDate = dueDate;
    quotation.maintenance = maintenance;
    quotation.security = security;
    quotation.assets = assets;
    quotation.fileManagement = fileManagement;
    quotation.bookings = bookings;
    quotation.facility = facility;

    quotation.maintenancePrice = maintenancePrice;
    quotation.securityPrice = securityPrice;
    quotation.assetsPrice = assetsPrice;
    quotation.fileManagementPrice = fileManagementPrice;
    quotation.bookingsPrice = bookingsPrice;
    quotation.facilityPrice = facilityPrice;
    quotation.total_with_or_without_dis = total_with_or_without_dis.toFixed(2);
    quotation.total_with_or_without_vat = total_with_or_without_vat.toFixed(2);
    quotation.discountAmount = discountPercentageAmt.toFixed(2);
    quotation.vatAmount = vatPercentageAmt.toFixed(2);

    const savedQuotation = await quotation.save();
    const createdDate = savedQuotation?.created_at?.toString().split("T")[0];

    if (savedQuotation) QuotationFunc(leadDetails, quotation.quotationNumber, invoiceSettingId, savedQuotation, createdDate, dueDate)

    sendResponseResult(savedQuotation, 200, res, req.baseUrl, false, req.method, false);
});


//* update quotation status and lead status
exports.updateQuotationStatusById = catchAsync(async (req, res, next) => {
    const { quotationStatus, leadStatus } = req.body;
    let quotationDet = await quotationModel.findOne({ _id: req.params.quoteId });

    if (!quotationDet) {
        return next(new AppError('No document found with this ID', 400));
    }

    quotationDet.status = quotationStatus;
    const savedQuotation = await quotationDet.save();
    await leadModel.findByIdAndUpdate(req.params.leadId, { status: leadStatus });
    sendResponseResult(savedQuotation, 200, res, req.baseUrl, false, req.method, false);
});



exports.getAllQuotations = getAll(quotationModel); //* get all quotations
exports.getQuotationById = getOne(quotationModel); //* get quotation by id
exports.deleteQuotation = deleteOne(quotationModel); //* delete a quotation