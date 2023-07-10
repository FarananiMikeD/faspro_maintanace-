const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const { createUtility, getAllUtilities, getUtilityById, updateUtilityById, deleteUtility, getUtilitiesByPropId, getUtilitiesByUnitId, getAllUtilityForCurrentMonthForUnit, getAllUtilityForCurrentMonthForProperty, checkUtilityStatus } = require('../controllers/utilityController');
const { packageMiddleware } = require('../controllers/packageController');


const router = express.Router(); updateUtilityById

router.get('/', protect, packageMiddleware, getAllUtilities);
router.get('/property/:PropId', protect, packageMiddleware, getUtilitiesByPropId);
router.get('/unit/:unitId', protect, packageMiddleware, getUtilitiesByUnitId);
router.get('/unit/month/:unitId', protect, packageMiddleware, getAllUtilityForCurrentMonthForUnit);
router.get('/property/month/:propId', protect, packageMiddleware, getAllUtilityForCurrentMonthForProperty);
router.get('/:id/:unitId', protect, packageMiddleware, checkUtilityStatus, getUtilityById);
router.post('/:propertyId/:unitId', protect, packageMiddleware, createUtility);

router.route('/:id')
    // .get(protect, packageMiddleware, getUtilityById)
    .patch(protect, packageMiddleware, restrictTo('property_owner_individual', 'property_owner_agency', 'property_owner_company'), updateUtilityById)
    .delete(protect, restrictTo('property_owner_individual', 'property_owner_agency', 'property_owner_company'), packageMiddleware, deleteUtility)

module.exports = router

