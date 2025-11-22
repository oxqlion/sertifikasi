module.exports = {
    class: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    instructor: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    participant: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    participantRegistration: {
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn()
    },
    instructorRegistration: {
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn()
    }
  };
  