const express = require('express');

const {
    propertyOwnersRegister,
    adminRegister,
    teamAdmin,
    propertyOwnersRegisterTeamMember,
    login,
    forgotPassword,
    resetPassword,
    protect,
    updatePassword,
    restrictTo,
    logout,
    verify,
    forgotPasswordMobile,
    resetPasswordMobile,
    verifyOtp
} = require('./../controllers/authController');

const {
    uploadUserPhoto,
    resizeUserPhoto
} = require('../controllers/firebaseImageController')

const router = express.Router({ mergeParams: true });

//! [1] REGISTRATION 
router.post('/property_owner/register', uploadUserPhoto, resizeUserPhoto, propertyOwnersRegister);
router.post('/admin/register', uploadUserPhoto, resizeUserPhoto, adminRegister);


//! [2] Only admin can interact with this API
router.post('/admin_team/register/:adminId',
    protect,
    restrictTo(
        "admin"
    ), uploadUserPhoto, resizeUserPhoto, teamAdmin);


//! [3] Only the user with this roles can interact with this API
router.post('/property_owner/register/:propOwnerId',
    protect,
    restrictTo(
        "admin",
        "portfolio_manager",
        "property_agency",
        "property_owner_company",
        "property_owner_individual"
    ), uploadUserPhoto, resizeUserPhoto, propertyOwnersRegisterTeamMember);


//! [4] Only the user with this roles can interact with this API
router.post('/service_prov_team/register/:serviceProId',
    protect,
    restrictTo(
        "service_provider_manager"
    ), uploadUserPhoto, resizeUserPhoto, propertyOwnersRegisterTeamMember);


//! [5] Only the user with this roles can interact with this API
router.post('/security_team/register/:securityId',
    protect,
    restrictTo(
        "security_manger",
    ), uploadUserPhoto, resizeUserPhoto, propertyOwnersRegisterTeamMember);


//! [6] Only the user with this roles can interact with this API
router.post('/tenant_team/register/:tenantId',
    protect,
    restrictTo(
        "tenant",
        "guest_tenant",
        "co_tenant"
    ), uploadUserPhoto, resizeUserPhoto, propertyOwnersRegisterTeamMember);


//! [7] LOGIN, LOGOUT, VERIFY, FORGET & RESET
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/verify/:id/:token/', verify);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

//* For mobile
router.post('/forgotPassword-mobile', forgotPasswordMobile);
router.post('/verifyOtp', verifyOtp);
router.patch('/resetPassword-mobile', resetPasswordMobile);

router.patch('/updateMyPassword', protect, updatePassword);

module.exports = router