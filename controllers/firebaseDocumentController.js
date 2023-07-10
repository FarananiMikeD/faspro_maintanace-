const multer = require('multer');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const bucket = require("../firebaseConfig")

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
        cb(null, true);
    } else {
        cb(new AppError('Only PDF and Word documents are allowed!', 400), false);
    }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadNoticeDocument = upload.single('noticeDocument');
exports.saveNoticeDocument = catchAsync(async (req, res, next) => {
    if (req.file) {
        const fileBuffer = req.file.buffer;

        const file = bucket.file(`Documents/Notices/${req.file.filename}`);
        const writeStream = file.createWriteStream({
            metadata: {
                contentType: 'application/pdf'
            }
        });

        writeStream.on('error', (error) => {
            console.error('Error writing file:', error);
            next(error); // Pass the error to the error-handling middleware
        });

        writeStream.on('finish', async () => {
            // Generate a signed URL for the uploaded file
            const signedUrlConfig = {
                action: 'read',
                expires: '03-01-2030' // Specify the expiration date for the URL
            };
            const signedUrl = await file.getSignedUrl(signedUrlConfig);

            // Assign the Firebase Storage URL to req.file.filename
            req.file.filename = signedUrl[0];
            next(); // Call next after assigning the signed URL
        });

        writeStream.end(fileBuffer);
    } else {
        next();
    }
});



exports.uploadLeaseDocument = upload.single('leaseAgreement');
exports.saveLeaseDocument = catchAsync(async (req, res, next) => {
    if (req.file) {
        if (!req?.user?.id) {
            req.file.filename = `lease-${Date.now()}.pdf`;
        } else {
            req.file.filename = `lease-${req?.user?.id}-${Date.now()}.pdf`;
        }

        const fileBuffer = req.file.buffer;

        const file = bucket.file(`Documents/Leases/${req.file.filename}`);
        const writeStream = file.createWriteStream({
            metadata: {
                contentType: 'application/pdf'
            }
        });

        writeStream.on('error', (error) => {
            console.error('Error writing file:', error);
        });

        writeStream.on('finish', async () => {
            // Generate a signed URL for the uploaded file
            const signedUrlConfig = {
                action: 'read',
                expires: '03-01-2030' // Specify the expiration date for the URL
            };
            const signedUrl = await file.getSignedUrl(signedUrlConfig);

            // Assign the Firebase Storage URL to req.file.filename
            req.file.filename = signedUrl[0];

            next(); // Call next after assigning the signed URL
        });

        writeStream.end(fileBuffer);
    } else {
        next();
    }
});

