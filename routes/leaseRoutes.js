const express = require('express');
const { protect, restrictTo } = require('./../controllers/authController');
const { createLease, getAllLeases, getLeaseById, updateLeaseById, deleteLease, getLeasesByPropId, getLeasesByUnitId, checkLeaseEndDate } = require('../controllers/leaseController');
const { packageMiddleware } = require('../controllers/packageController');
const { uploadLeaseDocument, saveLeaseDocument } = require('../controllers/firebaseDocumentController');

const router = express.Router();

router.get('/', protect, packageMiddleware, getAllLeases);
router.get('/property/:PropId', protect, packageMiddleware, getLeasesByPropId);
router.get('/unit/:unitId', protect, packageMiddleware, getLeasesByUnitId);
router.post('/:propertyId/:unitId', protect, packageMiddleware, uploadLeaseDocument, saveLeaseDocument, createLease);

router.route('/:id')
    .get(protect, packageMiddleware, checkLeaseEndDate, getLeaseById)
    .patch(protect, packageMiddleware, uploadLeaseDocument, saveLeaseDocument, updateLeaseById)
    .delete(protect, restrictTo('property_owner_individual', 'property_owner_agency', 'property_owner_company'), packageMiddleware, deleteLease)

module.exports = router

