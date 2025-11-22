const express = require('express');
const router = express.Router();
const participantController = require('../controllers/participantController');

router.post('/', participantController.createParticipant);
router.get('/', participantController.getAllParticipants);
router.get('/:id', participantController.getParticipantById);
router.put('/:id', participantController.updateParticipant);
router.delete('/:id', participantController.deleteParticipant);

module.exports = router;
