const express = require('express');
const { protect, restrictTo } = require('./../controllers/authController');
const { createProperty, getAllProperties, gePropertiesByPropId, updatePropertyById, deleteProperty, gePropertiesByUserId } = require('../controllers/propertyController');
// const { uploadPropertyImage, resizePropertyImage } = require('../controllers/imageController');
const { uploadPropertyImage, resizePropertyImage } = require('../controllers/firebaseImageController');
const { packageMiddleware } = require('../controllers/packageController');

const router = express.Router();

router.get('/', protect, getAllProperties);
router.get('/property_owner', protect, packageMiddleware, gePropertiesByUserId);
router.post('/:userId/:packageId', protect, uploadPropertyImage, resizePropertyImage, createProperty);

router.route('/:id')
    .get(protect, packageMiddleware, gePropertiesByPropId)
    .patch(protect, packageMiddleware, uploadPropertyImage, resizePropertyImage, updatePropertyById)
    .delete(protect, restrictTo('property_owner_individual', 'property_owner_agency', 'property_owner_company', 'admin'), packageMiddleware, deleteProperty)

module.exports = router
