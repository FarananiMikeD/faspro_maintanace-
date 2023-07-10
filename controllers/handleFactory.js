const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const jwt = require("jsonwebtoken");

/**
 * Create a JWT token with the given ID.
 *
 * @param {string} id - The ID to include in the token payload.
 * @returns {string} The signed JWT token.
 */
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

/**
 * Send a JSON response with the given data and metadata, including a signed JWT cookie.
 *
 * @param {object} data - The data to include in the response body.
 * @param {number} statusCode - The HTTP status code for the response.
 * @param {object} res - The Express response object to send the response through.
 * @param {string} baseUrl - The base URL for the API endpoint.
 * @param {boolean} object - Whether the data is an array (true) or a single object (false).
 * @param {string} method - The HTTP method used to access the endpoint.
 * @param {boolean} has_more - Whether there are more results available than were included in this response.
 */
const sendResponseResult = (data, statusCode, res, baseUrl, object, method, has_more) => {
    // Create and send a signed JWT cookie.
    const token = signToken(data._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }
    res.cookie('jwt', token, cookieOptions);

    // Remove the password field from the response data before sending it.
    data.password = undefined;

    // Send the response with the appropriate metadata.
    res.status(statusCode).json({
        status: 'success',
        token,
        length: data?.length,
        object: object ? 'list' : 'not a list',
        has_more: has_more,
        data,
        Url: baseUrl.split('i')[1],
        method: `/${method}`,
    });
};





/**
 * Get all documents from a Model
 *
 * @param {Model} Model - Mongoose Model
 * @returns {Function} - Express controller function
 */
//* BEFORE
// exports.getAll = Model => catchAsync(async (req, res, next) => {
//     // 1) Filter by tour ID if it is provided in the request parameters
//     let filter = {};
//     if (req.params.tourId) {
//         filter = { tour: req.params.tourId };
//     }

//     // 2) Build the API features and execute the query
//     const features = new APIFeatures(Model.find(filter), req.query)
//         .filter()
//         .sort()
//         .limitFields()
//         .paginate();
//     const doc = await features.query;

//     // 3) Send the response
//     sendResponseResult(doc, 200, res, req.baseUrl, true, req.method, false);
// });

exports.getAll = Model => catchAsync(async (req, res, next) => {
    // 1) Check if the roles query parameter is set to "admin"
    if (req.query.roles === "admin") {
        // 2) Exclude documents that have the "admin" role in their roles array
        const doc = await Model.find({ roles: { $ne: "admin" } });

        // 3) Send the response
        sendResponseResult(doc, 200, res, req.baseUrl, true, req.method, false);
    } else {
        // 4) Filter by tour ID if it is provided in the request parameters
        let filter = {};
        if (req.params.tourId) {
            filter = { tour: req.params.tourId };
        }

        // 5) Build the API features and execute the query
        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const doc = await features.query;

        // 6) Send the response
        sendResponseResult(doc, 200, res, req.baseUrl, true, req.method, false);
    }
});





/**
 * Retrieves all team members of an event organization
 * @param {MongooseModel} Model - The Mongoose model to query
 */
exports.getTeamByOwnerID = Model => catchAsync(async (req, res, next) => {
    // Find all team members that belong to the event organization of the authenticated user
    // const findByUser = { propertyOwnerId: req.user.id, securityManagerId: req.user.id };
    // const features = new APIFeatures(Model.find(findByUser), req.query)

    const userFieldName = req.query.fieldName; // Get the field name from the query parameter
    const findByUser = {};
    findByUser[userFieldName] = req.user.id; // Set the user ID based on the provided field name
    const features = new APIFeatures(Model.find(findByUser), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const data = await features.query;

    // Send response with team member data
    sendResponseResult(data, 200, res, req.baseUrl, true, req.method, false);
});




exports.getByPropID = Model => catchAsync(async (req, res, next) => {

    let findByUser;
    if (req.query.createdOn) {
        findByUser = {
            propertyId: req.params.PropId,
            createdOn: {
                $gte: new Date(`${req?.query?.createdOn}-01-01`),
                $lte: new Date(`${req?.query?.createdOn}-12-31T23:59:59.999Z`)
            }
        };

    } else {
        findByUser = {
            propertyId: req.params.PropId,
        };
    }
    const features = new APIFeatures(Model.find(findByUser), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    if (req?.query?.createdOn) {
        const year = parseInt(req?.query?.createdOn);
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
        features.query = features.query.where('createdOn').gte(startDate).lte(endDate);
    }

    features.search().populate().aggregate();
    const property = await features.query;

    sendResponseResult(property, 200, res, req.baseUrl, true, req.method, false);
});



exports.getByUnitID = Model => catchAsync(async (req, res, next) => {
    let findByUser;
    if (req.query.createdOn) {
        findByUser = {
            unitId: req.params.unitId,
            createdOn: {
                $gte: new Date(`${req?.query?.createdOn}-01-01`),
                $lte: new Date(`${req?.query?.createdOn}-12-31T23:59:59.999Z`)
            }
        };

    } else {
        findByUser = {
            unitId: req.params.unitId
        };
    }
    const features = new APIFeatures(Model.find(findByUser), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    if (req?.query?.createdOn) {
        const year = parseInt(req?.query?.createdOn);
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
        features.query = features.query.where('createdOn').gte(startDate).lte(endDate);
    }

    features.search().populate().aggregate();
    const property = await features.query;

    sendResponseResult(property, 200, res, req.baseUrl, true, req.method, false);
});



// /**
//  * Returns a list of team members associated with the logged in admin user.
//  * @param {Model} Model - The Mongoose Model to query
//  */
// exports.AdminTeamMembers = Model => catchAsync(async (req, res, next) => {
//     // Find team members associated with the logged in admin user
//     const findByUser = { admin_id: req.user.id };

//     // Apply filtering, sorting, field limiting and pagination to the query
//     const features = new APIFeatures(Model.find(findByUser), req.query)
//         .filter()
//         .sort()
//         .limitFields()
//         .paginate();

//     // Execute the query and get the resulting team members
//     const teamMembers = await features.query;

//     // Send the response with the team members
//     res.status(200).json({
//         status: 'success',
//         results: teamMembers.length,
//         data: {
//             teamMembers,
//         },
//     });
// });




/**
 * Returns a middleware function that retrieves a list of team members for the current exhibitor.
 * 
 * @param {Model} Model - The database model to query.
 * @returns {Function} - Express middleware function.
 */
exports.ExhibitorTeamMembers = Model => catchAsync(async (req, res, next) => {
    // Build the filter object to find team members associated with the current exhibitor.
    const findByUser = { exhibitor_id: req.user.id };

    // Apply filtering, sorting, field limiting, and pagination to the query.
    const features = new APIFeatures(Model.find(findByUser), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    // Execute the query and retrieve the list of team members.
    const users = await features.query;

    // Send the list of team members to the client.
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            data: users,
        },
    });
});





/**
 * Get a single document by ID
 * @param {Model} Model - The Mongoose model to query
 * @param {string|object} popOptions - Optional population options for related documents
 * @returns {Function} - An async Express middleware function that handles the request
 */
exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    // Select fields to exclude from the query result
    const unselectField = '-terms -passwordResetExpires -passwordResetToken -__v';
    // const unselectField = '-roles -terms -verified -status -passwordResetExpires -passwordResetToken -__v';

    // Build the query for the specified document ID, excluding unneeded fields
    let query = Model.findById(req.params.id).select(unselectField);

    // If population options are specified, include related documents in the result
    if (popOptions) {
        query = query.populate(popOptions);
    }

    // Execute the query and retrieve the document
    const doc = await query;

    // If no document is found, return an error response
    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    // Send the document in the response
    sendResponseResult(doc, 200, res, req.baseUrl, false, req.method, false);
});











/**
 * Update a document in the given model with the data provided in the request body and/or file upload.
 *
 * @param {Model} Model - The Mongoose model to update a document in.
 * @returns {Function} An Express middleware function that updates the document and returns a JSON response.
 */
exports.updateOne = (Model) => catchAsync(async (req, res, next) => {
    // Get the request body and add the filename of any uploaded photo to it, if applicable.
    const requestBody = req.body;
    if (req.file) {
        requestBody.propertyImage = req.file.filename;
        requestBody.profilePic = req.file.filename;
        requestBody.noticeDocument = req.file.filename;
        requestBody.leaseAgreement = req.file.filename;
        // Add similar code to handle other uploaded files, if necessary.
    }

    // Find the document by its ID and update it with the request body.
    const doc = await Model.findByIdAndUpdate(req.params.id, requestBody, {
        new: true, // Return the updated document instead of the old one.
        runValidators: true, // Validate the request body against the Mongoose schema.
    });

    // If no document was found with the given ID, return a 404 error.
    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    sendResponseResult(doc, 200, res, req.baseUrl, false, req.method, false);
});



//* Admin Deleting the user details using the user ID
/**
 * Delete a document from the given model by its ID.
 *
 * @param {Model} Model - The Mongoose model to delete from.
 * @returns {Function} An Express middleware function that deletes the document and returns a JSON response.
 */
exports.deleteOne = (Model) => catchAsync(async (req, res, next) => {
    // Find the document by its ID and delete it.
    const doc = await Model.findByIdAndDelete(req.params.id);

    // If no document was found with the given ID, return a 404 error.
    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(202).json({
        status: 'success',
        data: null,
    });
});



/**
 * Delete a document from the given model by setting the "active" field to false.
 *
 * @param {Model} Model - The Mongoose model to delete from.
 * @returns {Function} An Express middleware function that deletes the document and returns a JSON response.
 */
exports.deleteFromEndUser = (Model) => catchAsync(async (req, res, next) => {
    // Find the document by ID and set the "active" field to false.
    const result = await Model.findByIdAndUpdate(req.params.id, { active: false });

    // If no document was found with the given ID, return a 404 error.
    if (!result) {
        return next(new AppError('No document found with that ID', 404));
    }

    // If the document was successfully deleted, return a success response.
    res.status(202).json({
        status: 'success',
        data: null,
    });
});



/**
 * Create a new document in the given model with the data provided in the request body.
 *
 * @param {Model} Model - The Mongoose model to create a document in.
 * @returns {Function} An Express middleware function that creates the document and returns a JSON response.
 */
exports.createOne = (Model) => catchAsync(async (req, res, next) => {
    // Create a new document with the data provided in the request body.
    const doc = await Model.create(req.body);

    // Return a success response with the created document as the response data.
    res.status(201).json({
        status: 'success',
        data: {
            data: doc,
        },
    });
});
