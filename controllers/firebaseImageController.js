const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const bucket = require('../firebaseConfig')

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// * Upload user profile 
exports.uploadUserPhoto = upload.single('profilePic');
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (req?.file) {
        if (!req?.user?.id) {
            req.file.filename = `firebase-user-${Date.now()}.jpeg`;
        } else {
            req.file.filename = `firebase-user-${req?.user?.id}-${Date.now()}.jpeg`;
        }
        const photoBuffer = await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 100 })
            .toBuffer();

        const photoFile = bucket.file(`Images/users/${req.file.filename}`);
        await photoFile.save(photoBuffer);

        // Generate a signed URL for the uploaded file
        const signedUrlConfig = {
            action: 'read',
            expires: '03-01-2080' // Specify the expiration date for the URL
        };
        const signedUrl = await photoFile.getSignedUrl(signedUrlConfig);

        // Assign the Firebase Storage URL to req.file.filename
        req.file.filename = signedUrl[0];
    }
    next();
});

// * Upload property images
exports.uploadPropertyImage = upload.single('propertyImage');
exports.resizePropertyImage = catchAsync(async (req, res, next) => {
    if (req?.file) {
        if (!req?.user?.id) {
            req.file.filename = `property-${Date.now()}.jpeg`;
        } else {
            req.file.filename = `property-${req?.user?.id}-${Date.now()}.jpeg`;
        }
        const photoBuffer = await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 100 })
            .toBuffer();

        const photoFile = bucket.file(`Images/property/${req.file.filename}`);
        await photoFile.save(photoBuffer);

        // Generate a signed URL for the uploaded file
        const signedUrlConfig = {
            action: 'read',
            expires: '03-01-2030' // Specify the expiration date for the URL
        };
        const signedUrl = await photoFile.getSignedUrl(signedUrlConfig);

        // Assign the Firebase Storage URL to req.file.filename
        req.file.filename = signedUrl[0];
    }
    next();
});
