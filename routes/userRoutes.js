const express = require('express');
const { protect, restrictTo } = require('./../controllers/authController');
const { getAllUsers, updateMe, deactivateAccount, getUser, deleteUser, getMe, getAllTeamsByTeamOwnerId, susPendUser, unSusPendUser, propertyOwnerGetTenant, adminGetallTenant, updateUserRole } = require('../controllers/userController');
// const {
//     uploadUserPhoto,
//     resizeUserPhoto
// } = require('../controllers/imageController')
const {
    uploadUserPhoto,
    resizeUserPhoto
} = require('../controllers/firebaseImageController')

const router = express.Router();


//! [1] GET DETAILS & UPDATE DETAILS 
router.get('/me', protect, getMe, getUser) //get my details
router.patch('/updateMe', protect, uploadUserPhoto, resizeUserPhoto, updateMe); // update my details
router.patch('/:userId/updateUser', protect, updateUserRole); // update my details
router.delete('/deactivate', protect, deactivateAccount);
//! END


//![2] ADMIN GET ALL HIS USERS
router.route('/admin').get(
    protect,
    restrictTo(
        'admin',
        'admin_marketing',
        'admin_sales',
        'admin_assistant',
        'admin_finance'), getAllUsers)


router.route('/team').get(
    protect,
    restrictTo(
        "property_owner_individual",
        "property_owner_agency",
        "property_owner_company",
        "portfolio_manager",
        "property_agency",
        "security_manger",
        "tenant",
    ),
    getAllTeamsByTeamOwnerId)

router.route('/propertyOwner/:PropOwnerId').get(protect, propertyOwnerGetTenant)
router.route('/admin/tenants').get(protect, adminGetallTenant)

router.route('/:id')
    .get(protect, getUser)
    .delete(protect, restrictTo('admin', 'admin_assistant', 'property_owner_individual', 'property_owner_agency', 'property_owner_company', 'tenant'), deleteUser)


router.route('/:id/suspended')
    .patch(protect, restrictTo('admin', 'admin_assistant', 'property_owner_individual', 'property_owner_agency', 'property_owner_company'), susPendUser)


router.route('/:id/un-suspended')
    .patch(protect, restrictTo('admin', 'admin_assistant', 'property_owner_individual', 'property_owner_agency', 'property_owner_company'), unSusPendUser)


module.exports = router