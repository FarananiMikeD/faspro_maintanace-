const express = require('express');
const { protect, restrictTo } = require('./../controllers/authController');
const { createExtraCharge, getAllExtraCharges, getExtraChargeById, updateExtraChargeById, deleteExtraCharge, getExtraChargesByPropId, getExtraChargesByUnitId, getAllExtraChargesForCurrentMonthForUnit, getAllExtraChargesForCurrentMonthForProperty, checkExtraChargeStatus } = require('../controllers/extraChargeController');
const { packageMiddleware } = require('../controllers/packageController');
const { uploadLeaseDocument, saveLeaseDocument } = require('../controllers/documentController');

const router = express.Router();

router.get('/', protect, packageMiddleware, getAllExtraCharges);
router.get('/property/:PropId', protect, packageMiddleware, getExtraChargesByPropId);
router.get('/unit/:unitId', protect, packageMiddleware, getExtraChargesByUnitId);
router.get('/unit/month/:unitId', protect, packageMiddleware, getAllExtraChargesForCurrentMonthForUnit);
router.get('/property/month/:propId', protect, packageMiddleware, getAllExtraChargesForCurrentMonthForProperty);
router.get('/:id/:unitId', protect, packageMiddleware, checkExtraChargeStatus, getExtraChargeById);
router.post('/:propertyId/:unitId', protect, packageMiddleware, createExtraCharge);


router.route('/:id')
    // .get(protect, packageMiddleware, getExtraChargeById)
    .patch(protect, packageMiddleware, uploadLeaseDocument, saveLeaseDocument, updateExtraChargeById)
    .delete(protect, restrictTo('property_owner_individual', 'property_owner_agency', 'property_owner_company'), packageMiddleware, deleteExtraCharge)

module.exports = router

