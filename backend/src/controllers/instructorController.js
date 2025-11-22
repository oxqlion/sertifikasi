const prisma = require('../config/prisma');

// Create new instructor
exports.createInstructor = async (req, res) => {
  try {
    const { name, email, phone, specialty } = req.body;
    const instructor = await prisma.instructor.create({
      data: { name, email, phone, specialty }
    });
    res.status(201).json(instructor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all instructors
exports.getAllInstructors = async (req, res) => {
  try {
    const instructors = await prisma.instructor.findMany({
      include: {
        classes: true,
        instructorRegistrations: {
          include: { class: true }
        }
      }
    });
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get instructor by ID
exports.getInstructorById = async (req, res) => {
  try {
    const { id } = req.params;
    const instructor = await prisma.instructor.findUnique({
      where: { id },
      include: {
        classes: true,
        instructorRegistrations: {
          include: { class: true }
        }
      }
    });
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor not found' });
    }
    res.json(instructor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update instructor
exports.updateInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, specialty } = req.body;
    const instructor = await prisma.instructor.update({
      where: { id },
      data: { name, email, phone, specialty }
    });
    res.json(instructor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete instructor
exports.deleteInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.instructor.delete({
      where: { id }
    });
    res.json({ message: 'Instructor deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};