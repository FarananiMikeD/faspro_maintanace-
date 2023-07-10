
const blockModel = require('../models/blockModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendResponseResult } = require("../response/Response")
const { getAll, getOne, updateOne, deleteOne, getTeamByOwnerID, getByPropID } = require('./handleFactory');


//* Create a subscription 
exports.createBlock = catchAsync(async (req, res, next) => {

    const { blockName, blockNumber, blockAddress, blockSize, numberOfUnits, TenantInformation, maintenanceInformation, Amenities } = req.body;

    const newProperty = new blockModel({
        userId: req.params.userId,
        propertyId: req.params.propertyId,
        blockName,
        blockNumber,
        blockAddress,
        blockSize,
        numberOfUnits,
        Amenities,
        maintenanceInformation,
        TenantInformation,
    });

    const savedProperty = await newProperty.save();

    sendResponseResult(savedProperty, 201, res, req.baseUrl, false, req.method, false);
});


exports.getAllBlocks = getAll(blockModel);
exports.getBlocksById = getOne(blockModel);
exports.getBlocksByPropId = getByPropID(blockModel);
exports.updateBlockById = updateOne(blockModel);
exports.deleteBlock = deleteOne(blockModel);




