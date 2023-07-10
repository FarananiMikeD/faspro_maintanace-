const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const { createQuotation, getAllQuotations, getQuotationById, updateQuotationById, deleteQuotation, updateQuotationStatusById } = require('../controllers/quotationController');

const router = express.Router();

router.get('/', protect, getAllQuotations);
router.post('/:leadId/:settingId', protect, createQuotation);
router.patch('/:quoteId/:leadId/:settingId', protect, updateQuotationById);

router.route('/:id')
    .get(protect, getQuotationById)
    .delete(protect, deleteQuotation)

router.patch('/:quoteId/:leadId', protect, updateQuotationStatusById);

module.exports = router


