const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const { createLeadInvoice, getAllLeadInvoice, getLeadInvoiceById, deleteLeadInvoice, updateLeadInvoiceById, updateInvoiceStatusById, updateInvoiceStatusToPaid } = require('../controllers/leadInvoiceController');

const router = express.Router();

router.get('/', protect, getAllLeadInvoice);
router.post('/:leadId/:settingId/:quotationId', protect, createLeadInvoice);

router.route('/:id')
    .get(protect, getLeadInvoiceById)
    .patch(protect, updateLeadInvoiceById)
    .delete(protect, deleteLeadInvoice)

router.route('/:id/register').get(getLeadInvoiceById)
router.patch('/:invoiceId/:leadId', protect, updateInvoiceStatusById);
router.patch('/:leadId/:settingId/:invoiceId', protect, updateInvoiceStatusToPaid);

module.exports = router

