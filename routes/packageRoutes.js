const express = require('express');
const { protect, restrictTo } = require('./../controllers/authController');
const { createSubscriptionPackage, packageMiddleware, getAllPackages, gePackageByPageId, updatePackageById, deletePackage, gePackageByUserId } = require('../controllers/packageController');

const router = express.Router();

router.get('/', protect, getAllPackages);
router.post('/:userId', protect, createSubscriptionPackage);
router.get('/property_owner', protect, gePackageByUserId);
router.post('/:userId', protect, packageMiddleware);

router.route('/:id')
    .get(protect, gePackageByPageId)
    .patch(protect, updatePackageById)
    .delete(protect, restrictTo('admin'), deletePackage)

module.exports = router
