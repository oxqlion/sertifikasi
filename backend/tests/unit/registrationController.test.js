const prisma = require('../__mocks__/prisma');
const mockRes = require('../helpers/mockResponse');

const {
  registerParticipant,
  getParticipantClasses,
  getClassParticipants,
  cancelParticipantRegistration,
  registerInstructor,
  getInstructorClasses,
  getClassInstructors,
  cancelInstructorRegistration
} = require('../../src/controllers/registrationController');

jest.mock('../../src/config/prisma', () => require('../__mocks__/prisma'));

describe("registrationController", () => {

  beforeEach(() => jest.clearAllMocks());

  test("registerParticipant", async () => {
    const req = { body: { participantId: "1", classId: "10" } };
    const res = mockRes();

    prisma.participantRegistration.create.mockResolvedValue({
      id: "123",
      ...req.body
    });

    await registerParticipant(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("getParticipantClasses", async () => {
    const req = { params: { participantId: "1" } };
    const res = mockRes();

    prisma.participantRegistration.findMany.mockResolvedValue([]);

    await getParticipantClasses(req, res);

    expect(prisma.participantRegistration.findMany).toHaveBeenCalled();
  });

  test("registerInstructor", async () => {
    const req = { body: { instructorId: "3", classId: "10" } };
    const res = mockRes();

    prisma.instructorRegistration.create.mockResolvedValue({
      id: "100",
      ...req.body
    });

    await registerInstructor(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("registerParticipant - duplicate registration should return 400", async () => {
    const req = { body: { participantId: "1", classId: "10" } };
    const res = mockRes();
  
    prisma.participantRegistration.create.mockRejectedValue(
      new Error("Unique constraint failed")
    );
  
    await registerParticipant(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
  });
  
  test("registerParticipant - participant not found", async () => {
    const req = { body: { participantId: "1", classId: "10" } };
    const res = mockRes();
  
    prisma.participantRegistration.create.mockRejectedValue(
      new Error("Foreign key constraint failed")
    );
  
    await registerParticipant(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
  });
  
  test("cancelParticipantRegistration - record not found", async () => {
    const req = { params: { id: "111" } };
    const res = mockRes();
  
    prisma.participantRegistration.delete.mockRejectedValue(
      new Error("Record not found")
    );
  
    await cancelParticipantRegistration(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
  });
  
  test("getClassInstructors - empty result", async () => {
    const req = { params: { classId: "99" } };
    const res = mockRes();
  
    prisma.instructorRegistration.findMany.mockResolvedValue([]);
  
    await getClassInstructors(req, res);
  
    expect(res.json).toHaveBeenCalledWith([]);
  });
  
  test("registerInstructor - duplicate assignment should return 400", async () => {
    const req = { body: { instructorId: "3", classId: "10" } };
    const res = mockRes();
  
    prisma.instructorRegistration.create.mockRejectedValue(
      new Error("Unique constraint failed")
    );
  
    await registerInstructor(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
  });

});
