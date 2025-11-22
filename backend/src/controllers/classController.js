const prisma = require('../config/prisma');

// Create new class
exports.createClass = async (req, res) => {
  try {
    const { name, description, instructorId } = req.body;
    const classItem = await prisma.class.create({
      data: { name, description, instructorId },
      include: { instructor: true }
    });
    res.status(201).json(classItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all classes
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        instructor: true,
        participantRegistrations: {
          include: { participant: true }
        },
        instructorRegistrations: {
          include: { instructor: true }
        }
      }
    });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get class by ID
exports.getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const classItem = await prisma.class.findUnique({
      where: { id },
      include: {
        instructor: true,
        participantRegistrations: {
          include: { participant: true }
        },
        instructorRegistrations: {
          include: { instructor: true }
        }
      }
    });
    if (!classItem) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json(classItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update class
exports.updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, instructorId } = req.body;
    const classItem = await prisma.class.update({
      where: { id },
      data: { name, description, instructorId },
      include: { instructor: true }
    });
    res.json(classItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete class
exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.class.delete({
      where: { id }
    });
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

