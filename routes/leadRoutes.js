const express = require('express');
const { protect, restrictTo } = require('./../controllers/authController');
const { createLead, getAllLead, getLeadById, updateLeadById, deleteLead, getLeadByPropId, getLeadByUnitId, sendIndividualEmail } = require('../controllers/leadController');

const router = express.Router();

router.get('/', protect, getAllLead);
router.post('/', createLead);
router.get('/property/:PropId', protect, getLeadByPropId);
router.get('/unit/:unitId', protect, getLeadByUnitId);

router.route('/:id')
    .get(protect, getLeadById)
    .patch(protect, updateLeadById)
    .delete(protect, deleteLead)

router.route('/:id/register').get(getLeadById)


router.post('/register/:leadId', protect, sendIndividualEmail);

module.exports = router

