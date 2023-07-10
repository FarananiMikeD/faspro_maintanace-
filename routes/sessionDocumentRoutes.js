const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const {
    createSessionDocument,
    getSessionDocuments,
    getAllDocumentBySessionId,
    updateSessionDocumentById,
    deleteSessionDocuments
} = require('../controllers/sessionDocumentController');
const { uploadUserDocument, saveUserDocument } = require('../controllers/documentController');

const router = express.Router();

router.route('/:id')
    .get(protect, restrictTo('event_organizer'), getSessionDocuments)
    .post(protect, restrictTo('event_organizer'), uploadUserDocument, saveUserDocument, createSessionDocument)
    .patch(protect, restrictTo('event_organizer'), uploadUserDocument, saveUserDocument, updateSessionDocumentById)
    .delete(protect, restrictTo('event_organizer'), deleteSessionDocuments)

router.route('/document/:id')
    .get(protect, restrictTo('event_organizer'), getAllDocumentBySessionId)


module.exports = router