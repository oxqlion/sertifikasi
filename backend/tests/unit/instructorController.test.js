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

  test("createInstructor - duplicate email should return 400", async () => {
    const req = { body: { name: "John", email: "john@mail.com" } };
    const res = mockRes();
  
    prisma.instructor.create.mockRejectedValue(new Error("Unique constraint failed"));
  
    await createInstructor(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
  });
  
  test("getAllInstructors - empty list", async () => {
    const req = {};
    const res = mockRes();
  
    prisma.instructor.findMany.mockResolvedValue([]);
  
    await getAllInstructors(req, res);
  
    expect(res.json).toHaveBeenCalledWith([]);
  });
  
  test("updateInstructor - prisma error", async () => {
    const req = { params: { id: "20" }, body: { name: "New" } };
    const res = mockRes();
  
    prisma.instructor.update.mockRejectedValue(new Error("Update failed"));
  
    await updateInstructor(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
  });  

});
