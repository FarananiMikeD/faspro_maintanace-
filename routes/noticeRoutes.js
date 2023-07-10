const express = require('express');
const { protect, restrictTo } = require('./../controllers/authController');
const { createNotice, getAllNotices, getNoticesById, updateNoticeById, deleteNotice, getNoticesByPropId, getNoticesByUnitId } = require('../controllers/noticeController');
const { packageMiddleware } = require('../controllers/packageController');
const { uploadNoticeDocument, saveNoticeDocument } = require('../controllers/firebaseDocumentController');

const router = express.Router();

router.get('/', protect, packageMiddleware, getAllNotices);
router.get('/property/:PropId', protect, packageMiddleware, getNoticesByPropId);
router.get('/unit/:unitId', protect, packageMiddleware, getNoticesByUnitId);

router.post('/property/:propertyId', protect, uploadNoticeDocument, saveNoticeDocument, createNotice);
router.post('/unit/:unitId', protect, packageMiddleware, packageMiddleware, uploadNoticeDocument, saveNoticeDocument, createNotice);

router.route('/:id')
    .get(protect, packageMiddleware, getNoticesById)
    .patch(protect, packageMiddleware, uploadNoticeDocument, saveNoticeDocument, updateNoticeById)
    .delete(protect, restrictTo('property_owner_individual', 'property_owner_agency', 'property_owner_company'), packageMiddleware, deleteNotice)

module.exports = router

