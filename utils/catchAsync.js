const errorResponseResult = (statusCode, res, data, baseUrl, method) => {
    res.status(statusCode).json({
        status: 'error',
        data,
        Url: baseUrl,
        method: `/${method}`,
        has_more: false,
    });
};


module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            console.log("Display output : ", err);
            if (err.name === 'MongoServerError' && err.code === 11000) {
                const message = `Please review your input data carefully to avoid duplications, it looks like the data existed already in the system`
                errorResponseResult(500, res, message, req.baseUrl, req.method,)
            }

            if (err.message.includes('EHOSTUNREACH') || err.message.includes('ENETUNREACH')) {
                const message = `There seems to be an issue with your network connection. Please check your internet connection and try again.`
                errorResponseResult(500, res, message, req.baseUrl, req.method,)
            }

            // if (err instanceof JsonWebTokenError && err.message === 'jwt malformed') {
            if (err.message === 'jwt malformed') {
                const message = `Your session has expired. Please login again.`
                errorResponseResult(401, res, message, req.baseUrl, req.method,)
            }

            // if (err.name === 'ValidationError' && err.code === 500) {
            if (err.name === 'ValidationError') {
                const message = Object.values(err.errors).map(error => error.message).join(', ');
                // const message = "Please complete required field";
                errorResponseResult(500, res, message, req.baseUrl, req.method,)
            } else {
                // return res.status(500).json({ error: 'There is a problem on the server' });
                const message = `You have a network issue please try again`;
                errorResponseResult(500, res, message, req.baseUrl, req.method,)
            }

            next(err);
        });
    };
};
