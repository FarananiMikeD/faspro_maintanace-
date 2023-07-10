const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        console.error('ERROR 💥', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        sendErrorProd(error, res);
    }
};


//* chatGPT
// const AppError = require('./../utils/appError');
// const winston = require('winston');

// const handleCastErrorDB = err => {
//     const message = `Invalid ${err.path}: ${err.value}.`;
//     return new AppError(message, 400);
// };

// const handleDuplicateFieldsDB = err => {
//     const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
//     const message = `Duplicate field value: ${value}. Please use another value!`;
//     return new AppError(message, 400);
// };

// const handleValidationErrorDB = err => {
//     const errors = Object.values(err.errors).map(el => el.message);
//     const message = `Invalid input data. ${errors.join('. ')}`;
//     return new AppError(message, 400);
// };

// const sendError = (err, res, statusCode, message) => {
//     err.statusCode = statusCode || 500;
//     err.status = err.status || 'error';
//     res.status(err.statusCode).json({
//         status: err.status,
//         message: message || err.message
//     });
// };

// module.exports = (err, req, res, next) => {
//     // Log the error
//     winston.error(err);

//     // Handle known errors
//     if (err.name === 'CastError') {
//         const error = handleCastErrorDB(err);
//         return sendError(error, res);
//     }
//     if (err.code === 11000) {
//         const error = handleDuplicateFieldsDB(err);
//         return sendError(error, res);
//     }
//     if (err.name === 'ValidationError') {
//         const error = handleValidationErrorDB(err);
//         return sendError(error, res);
//     }

//     // Handle unknown errors
//     if (!err.isOperational) {
//         sendError(err, res, 500, 'Something went wrong!');
//         // Stop the application
//         process.exit(1);
//     }

//     // Handle operational errors
//     sendError(err, res);
// };
