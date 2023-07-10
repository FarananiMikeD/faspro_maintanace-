const express = require('express');
const { protect, restrictTo } = require('./../controllers/authController');
const { purChaseTicket } = require('../controllers/eventTicketController');
const { uploadEventSponsors, resizeEventSponsors, uploadPhotoTicketsImages, resizePhotoTicketImages } = require('../controllers/imageController');

const router = express.Router();

// router.route('/:buyerId/:eventId').post(purChaseTicket)

router.route('/:id')
    .get(protect, restrictTo('event_organizer'),)
    .patch(protect, restrictTo('event_organizer'), uploadPhotoTicketsImages, resizePhotoTicketImages)
    .delete(protect, restrictTo('event_organizer'),)

router.route('/:buyerId/:eventId').post(protect, uploadPhotoTicketsImages, resizePhotoTicketImages, purChaseTicket)

router.route('/sessions/:id')
    .get(protect, restrictTo('event_organizer'),)

module.exports = router