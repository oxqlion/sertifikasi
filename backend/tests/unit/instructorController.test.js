const prisma = require('../__mocks__/prisma');
const mockRes = require('../helpers/mockResponse');

const {
  createInstructor,
  getAllInstructors,
  getInstructorById,
  updateInstructor,
  deleteInstructor
} = require('../../src/controllers/instructorController');

jest.mock('../../src/config/prisma', () => require('../__mocks__/prisma'));

describe("instructorController", () => {

  beforeEach(() => jest.clearAllMocks());

  test("createInstructor", async () => {
    const req = { body: { name: "John", email: "a@a.com" } };
    const res = mockRes();

    prisma.instructor.create.mockResolvedValue({ id: "1", ...req.body });

    await createInstructor(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("getAllInstructors", async () => {
    const req = {};
    const res = mockRes();

    prisma.instructor.findMany.mockResolvedValue([{ id: "1" }]);

    await getAllInstructors(req, res);

    expect(res.json).toHaveBeenCalledWith([{ id: "1" }]);
  });

  test("getInstructorById - not found", async () => {
    const req = { params: { id: "999" } };
    const res = mockRes();

    prisma.instructor.findUnique.mockResolvedValue(null);

    await getInstructorById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

});
