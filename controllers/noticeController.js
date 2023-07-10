
const noticeModel = require('../models/noticeModel');
const catchAsync = require('../utils/catchAsync');
const { sendResponseResult } = require("../response/Response")
const { getAll, getOne, updateOne, deleteOne, getByPropID, getByUnitID } = require('./handleFactory');
const { extractIdFromAuthorizationHeader } = require('../token/tokenAndUserId');
const AppError = require('../utils/appError');

//* Create a subscription 
exports.createNotice = catchAsync(async (req, res, next) => {

    const senderId = extractIdFromAuthorizationHeader(req.headers.authorization);
    const { subject, description } = req.body;

    if (!subject || !description) {
        return next(new AppError(`Please check your input carefully some of the field like   title, description are required`, 400));
    }

    const newNotice = new noticeModel({
        userId: senderId,
        propertyId: req.params.propertyId,
        unitId: req.params.unitId,
        subject,
        description,
        noticeDocument: req?.file?.filename
    });

    const savedNotice = await newNotice.save();

    sendResponseResult(savedNotice, 201, res, req.baseUrl, false, req.method, false);
});

exports.getAllNotices = getAll(noticeModel);
exports.getNoticesById = getOne(noticeModel);
exports.getNoticesByPropId = getByPropID(noticeModel);
exports.getNoticesByUnitId = getByUnitID(noticeModel);
exports.updateNoticeById = updateOne(noticeModel);
exports.deleteNotice = deleteOne(noticeModel);