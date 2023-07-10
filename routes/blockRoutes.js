const express = require('express');
const { protect, restrictTo } = require('./../controllers/authController');
const { createBlock, getAllBlocks, getBlocksByPropId, updateBlockById, deleteBlock, getBlocksById } = require('../controllers/blockController');
const { packageMiddleware } = require('../controllers/packageController');

const router = express.Router();

router.get('/', protect, packageMiddleware, getAllBlocks);
router.get('/property/:PropId', protect, packageMiddleware, getBlocksByPropId);
router.post('/:userId/:propertyId', protect, packageMiddleware, createBlock);

router.route('/:id')
    .get(protect, packageMiddleware, getBlocksById)
    .patch(protect, packageMiddleware, updateBlockById)
    .delete(protect, restrictTo('property_owner_individual', 'property_owner_agency', 'property_owner_company'), packageMiddleware, deleteBlock)


module.exports = router
