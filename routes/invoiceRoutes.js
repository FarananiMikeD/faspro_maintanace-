const express = require('express');
const { protect, restrictTo } = require('./../controllers/authController');
const { createInvoice, getAllInvoices, getInvoiceById, updateInvoiceById, deleteInvoice, getInvoicesByPropId, getInvoicesByUnitId, checkIfInvoiceOverdue } = require('../controllers/invoiceController');
const { packageMiddleware } = require('../controllers/packageController');
const { uploadLeaseDocument, saveLeaseDocument } = require('../controllers/documentController');

const router = express.Router();

router.get('/', protect, packageMiddleware, getAllInvoices);
router.get('/property/:PropId', protect, packageMiddleware, getInvoicesByPropId);
router.get('/unit/:unitId', protect, packageMiddleware, checkIfInvoiceOverdue, getInvoicesByUnitId);
router.get('/:id/:unitId', protect, packageMiddleware, checkIfInvoiceOverdue, getInvoiceById)
router.post('/:propertyId/:unitId', protect, packageMiddleware, createInvoice);

router.route('/:id')
    .patch(protect, packageMiddleware, updateInvoiceById)
    .delete(protect, restrictTo('property_owner_individual', 'property_owner_agency', 'property_owner_company'), packageMiddleware, deleteInvoice)

// router.route('/:id/:unitId').get(protect, packageMiddleware, checkIfInvoiceOverdue, getInvoiceById)

module.exports = router