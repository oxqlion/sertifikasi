const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');

router.post('/', instructorController.createInstructor);
router.get('/', instructorController.getAllInstructors);
router.get('/:id', instructorController.getInstructorById);
router.put('/:id', instructorController.updateInstructor);
router.delete('/:id', instructorController.deleteInstructor);

module.exports = router;
