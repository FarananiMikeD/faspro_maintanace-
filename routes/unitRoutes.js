const express = require('express');
const { protect, restrictTo } = require('./../controllers/authController');
const { createUnit, getAllUnits, getUnitsByPropId, updateUnitById, deleteUnit, getUnitsByUserId, propertyReportStatistics, generatePropertyReportStatistics, getStatisticsByPropId, generateAgeAnalysesReport, getUnitDetByTenantID } = require('../controllers/unitController');
const { packageMiddleware } = require('../controllers/packageController');
const { checkUtilityStatus } = require('../controllers/utilityController');
const { checkExtraChargeStatus } = require('../controllers/extraChargeController');

const router = express.Router();

router.get('/', protect, packageMiddleware, getAllUnits);
router.get('/property_owner/:PropId', protect, packageMiddleware, checkUtilityStatus, checkExtraChargeStatus, getUnitsByUserId);
router.get('/property-statistics/:PropId', protect, packageMiddleware, generatePropertyReportStatistics);
router.get('/age-analyses/:PropId', protect, packageMiddleware, generateAgeAnalysesReport);
router.post('/property-statistics/:PropId', protect, packageMiddleware, propertyReportStatistics);
router.post('/:userId/:propertyId/:blockId?', protect, packageMiddleware, createUnit);

router.route('/:id')
    // This 2 are middleware the will keep checking the status of the extra charge and utility charges if the expiration date of this 2 has passed then when this route is being call change the status of the extra charge and utility charges to inactive
    // 1. checkUtilityStatus  2. checkExtraChargeStatus
    .get(protect, packageMiddleware, checkUtilityStatus, checkExtraChargeStatus, getUnitsByPropId)
    .patch(protect, packageMiddleware, updateUnitById)
    .delete(protect, restrictTo('property_owner_individual', 'property_owner_agency', 'property_owner_company'), packageMiddleware, deleteUnit)


//* this one it's for the table not the graph
router.route('/:PropId/statistics').get(protect, packageMiddleware, getStatisticsByPropId)
router.route('/tenants/:tenantId').get(protect, getUnitDetByTenantID)

module.exports = router
