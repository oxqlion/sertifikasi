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

  test("createParticipant - duplicate email should return 400", async () => {
    const req = { body: { name: "Rafi", email: "test@mail.com" } };
    const res = mockRes();
  
    prisma.participant.create.mockRejectedValue(new Error("Unique constraint failed"));
  
    await createParticipant(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
  });
  
  test("updateParticipant - missing fields", async () => {
    const req = { params: { id: "1" }, body: {} };
    const res = mockRes();
  
    prisma.participant.update.mockRejectedValue(new Error("Update failed"));
  
    await updateParticipant(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
  });
  
  test("deleteParticipant - record not found", async () => {
    const req = { params: { id: "99" } };
    const res = mockRes();
  
    prisma.participant.delete.mockRejectedValue(new Error("Record not found"));
  
    await deleteParticipant(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
  });
  

});
