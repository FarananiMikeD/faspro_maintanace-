//* UPLOADING MULTIPLE IMAGES

const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('./../utils/catchAsync');
const fs = require('fs');
const AppError = require('../utils/appError');

//* ---UPLOAD MULTIPLE IMAGES---
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        cb(null, true);
    } else {
        cb(new AppError('Only PDF and Word documents are allowed!', 400), false);
    }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });




exports.uploadNoticeDocument = upload.single('noticeDocument');
exports.saveNoticeDocument = catchAsync(async (req, res, next) => {
    // if (!req.file) return next();

    if (req.file) {
        if (!req?.user?.id) {
            req.file.filename = `notice-${Date.now()}.pdf`;
        } else {
            req.file.filename = `notice-${req?.user?.id}-${Date.now()}.pdf`;
        }

        const filePath = `public/docs/notices/${req.file.filename}`;
        const fileStream = fs.createWriteStream(filePath);
        fileStream.on('error', function (err) {
            console.log('Error writing file:', err);
        });
        fileStream.on('finish', function () {
            console.log('File saved:', filePath);
        });
        fileStream.write(req.file.buffer);
        fileStream.end();
    }

    next();
});



exports.uploadLeaseDocument = upload.single('leaseAgreement');
exports.saveLeaseDocument = catchAsync(async (req, res, next) => {
    if (req.file) {
        if (!req?.user?.id) {
            req.file.filename = `lease-${Date.now()}.pdf`;
        } else {
            req.file.filename = `lease-${req?.user?.id}-${Date.now()}.pdf`;
        }
        const filePath = `public/docs/leases/${req.file.filename}`;
        const fileStream = fs.createWriteStream(filePath);
        fileStream.on('error', function (err) {
            console.log('Error writing file:', err);
        });
        fileStream.on('finish', function () {
            console.log('File saved:', filePath);
        });
        fileStream.write(req.file.buffer);
        fileStream.end();
    }
    next();
});
