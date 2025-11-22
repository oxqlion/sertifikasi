const prisma = require('../__mocks__/prisma');
const mockRes = require('../helpers/mockResponse');

const {
  createParticipant,
  getAllParticipants,
  getParticipantById,
  updateParticipant,
  deleteParticipant
} = require('../../src/controllers/participantController');

jest.mock('../../src/config/prisma', () => require('../__mocks__/prisma'));

describe("participantController", () => {

  beforeEach(() => jest.clearAllMocks());

  test("createParticipant", async () => {
    const req = { body: { name: "Rafi" } };
    const res = mockRes();

    prisma.participant.create.mockResolvedValue({ id: "1", name: "Rafi" });

    await createParticipant(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("getAllParticipants", async () => {
    const req = {};
    const res = mockRes();

    prisma.participant.findMany.mockResolvedValue([{ id: "1" }]);

    await getAllParticipants(req, res);

    expect(res.json).toHaveBeenCalledWith([{ id: "1" }]);
  });

  test("getParticipantById - not found", async () => {
    const req = { params: { id: "999" } };
    const res = mockRes();

    prisma.participant.findUnique.mockResolvedValue(null);

    await getParticipantById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

});
