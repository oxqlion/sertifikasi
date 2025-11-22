const prisma = require('../config/prisma');

// Register participant to class
exports.registerParticipant = async (req, res) => {
  try {
    const { participantId, classId } = req.body;
    const registration = await prisma.participantRegistration.create({
      data: { participantId, classId },
      include: {
        participant: true,
        class: true
      }
    });
    res.status(201).json(registration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all classes for a participant
exports.getParticipantClasses = async (req, res) => {
  try {
    const { participantId } = req.params;
    const registrations = await prisma.participantRegistration.findMany({
      where: { participantId },
      include: { class: { include: { instructor: true } } }
    });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all participants in a class
exports.getClassParticipants = async (req, res) => {
  try {
    const { classId } = req.params;
    const registrations = await prisma.participantRegistration.findMany({
      where: { classId },
      include: { participant: true }
    });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel participant registration
exports.cancelParticipantRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.participantRegistration.delete({
      where: { id }
    });
    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Register instructor to class
exports.registerInstructor = async (req, res) => {
  try {
    const { instructorId, classId } = req.body;
    const registration = await prisma.instructorRegistration.create({
      data: { instructorId, classId },
      include: {
        instructor: true,
        class: true
      }
    });
    res.status(201).json(registration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all classes for an instructor
exports.getInstructorClasses = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const registrations = await prisma.instructorRegistration.findMany({
      where: { instructorId },
      include: { class: true }
    });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all instructors in a class
exports.getClassInstructors = async (req, res) => {
  try {
    const { classId } = req.params;
    const registrations = await prisma.instructorRegistration.findMany({
      where: { classId },
      include: { instructor: true }
    });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel instructor registration
exports.cancelInstructorRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.instructorRegistration.delete({
      where: { id }
    });
    res.json({ message: 'Instructor assignment cancelled successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};