

const AppError = require('./../utils/appError');

//* this middleware check 3 roles only, if the user try to pass another role, an error will be thrown
const allowedRoles = [
    "property_owner_individual",
    "property_owner_agency",
    "property_owner_company"
];

exports.validateRole = (req, next) => {
    if (!allowedRoles.includes(req.body.roles)) {
        return next(new AppError('Invalid role', 400));
    }
};



const allowedAdminRoles = [
    "admin",
    "admin_assistant",
    "admin_marketing",
    "admin_sales",
    "admin_finance",
    "admin_support",
];

exports.validateAdminRole = (req, next) => {
    if (!allowedAdminRoles.includes(req.body.roles)) {
        return next(new AppError('Invalid role', 400));
    }
};




const allowedTeamRoles = [
    "tenant",
    "guest_tenant",
    "co_tenant",
    "visitor",
    "property_mgt_marketing",
    "property_mgt_sales",
    "property_mgt_finance",
    "property_mgt_maintenance",
    "property_mgt_leasing_officer",
    "portfolio_manager",
    "property_agency",
    "security_manger",
    "security_worker",
    "service_provider_manager",
    "service_provider",

    //! ALVIN (this user has the same role as the portfolio manager)
    "facility_manager" //* new role alvin
];

exports.validateTeamRole = (req, next) => {
    if (!allowedTeamRoles.includes(req.body.roles)) {
        return next(new AppError('Invalid role', 400));
    }
};
