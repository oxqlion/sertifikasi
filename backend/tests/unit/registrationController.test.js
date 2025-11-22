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

});
