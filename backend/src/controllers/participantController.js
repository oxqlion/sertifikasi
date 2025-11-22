const prisma = require('../config/prisma');

// Create new participant
exports.createParticipant = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const participant = await prisma.participant.create({
      data: { name, email, phone }
    });
    res.status(201).json(participant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all participants
exports.getAllParticipants = async (req, res) => {
  try {
    const participants = await prisma.participant.findMany({
      include: {
        registrations: {
          include: { class: true }
        }
      }
    });
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get participant by ID
exports.getParticipantById = async (req, res) => {
  try {
    const { id } = req.params;
    const participant = await prisma.participant.findUnique({
      where: { id },
      include: {
        registrations: {
          include: { class: true }
        }
      }
    });
    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }
    res.json(participant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update participant
exports.updateParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const participant = await prisma.participant.update({
      where: { id },
      data: { name, email, phone }
    });
    res.json(participant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete participant
exports.deleteParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.participant.delete({
      where: { id }
    });
    res.json({ message: 'Participant deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
