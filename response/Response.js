const util = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');


const signToken = async (id) => {
    if (!id || !process.env.JWT_SECRET) {
        throw new AppError('The user ID is missing', 400);
    }

    const expiresIn = process.env.JWT_EXPIRES_IN || '1d';

    const sign = util.promisify(jwt.sign);

    try {
        const token = await sign({ id }, process.env.JWT_SECRET, { expiresIn });
        return token;
    } catch (err) {
        throw new AppError('Error signing token', 500);
    }
};


exports.sendResponseResult = async (data, statusCode, res, baseUrl, object, method, has_more) => {

    try {
        const token = await signToken(data._id);
        const cookieOptions = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        if (process.env.NODE_ENV === 'production') {
            cookieOptions.secure = true;
        }
        res.cookie('jwt', token, cookieOptions);

        data.password = undefined;

        res.status(statusCode).json({
            status: 'success',
            token,
            length: data?.length,
            object: object ? 'list' : 'not a list',
            has_more: has_more,
            data,
            Url: baseUrl,
            method: `/${method}`,
        });
    } catch (err) {
        next(new AppError('Error sending response', 500));
    }
};
