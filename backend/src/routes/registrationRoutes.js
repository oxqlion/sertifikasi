const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

// Participant registrations
router.post('/participant', registrationController.registerParticipant);
router.get('/participant/:participantId/classes', registrationController.getParticipantClasses);
router.get('/class/:classId/participants', registrationController.getClassParticipants);
router.delete('/participant/:id', registrationController.cancelParticipantRegistration);

// Instructor registrations
router.post('/instructor', registrationController.registerInstructor);
router.get('/instructor/:instructorId/classes', registrationController.getInstructorClasses);
router.get('/class/:classId/instructors', registrationController.getClassInstructors);
router.delete('/instructor/:id', registrationController.cancelInstructorRegistration);

module.exports = router;