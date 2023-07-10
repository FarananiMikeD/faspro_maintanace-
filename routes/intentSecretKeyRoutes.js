const express = require('express');
const { protect, restrictTo } = require('./../controllers/authController');
const { getPaymentDetails, replaceCardPayment, paymentIntentSecretKey, getIntentSecretKey } = require('../controllers/paymentController');

const router = express.Router();

router.get('/', protect, getIntentSecretKey);
router.post('/payment-intent-secret-key', protect, paymentIntentSecretKey);
router.post('/replace-card-payment', protect, replaceCardPayment);
router.get('/get-my-payment-details', protect, getPaymentDetails);

module.exports = router
