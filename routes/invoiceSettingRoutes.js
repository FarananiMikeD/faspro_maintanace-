const express = require('express');
const { protect, restrictTo } = require('./../controllers/authController');
const { createInvoiceSettings, getInvoiceSettings, updateInvoiceSettings } = require('../controllers/invoiceSettingController');

const router = express.Router();

router.post('/', protect, createInvoiceSettings);

router.route('/:id')
    .get(protect, getInvoiceSettings)
    .patch(protect, updateInvoiceSettings)


module.exports = router

