const prisma = require('../__mocks__/prisma');
const mockRes = require('../helpers/mockResponse');

// console.log("MOCK PRISMA: ", prisma);

const {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass
} = require('../../src/controllers/classController');

jest.mock('../../src/config/prisma', () => require('../__mocks__/prisma'));

describe("classController", () => {

  beforeEach(() => jest.clearAllMocks());

  test("createClass - success", async () => {
    const req = {
      body: { name: "Yoga 101", description: "Beginner", instructorId: "10" }
    };
    const res = mockRes();

    prisma.class.create.mockResolvedValue({
      id: "1",
      ...req.body,
      instructor: { id: "10", name: "Jane" }
    });

    await createClass(req, res);

    expect(prisma.class.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("getAllClasses - success", async () => {
    const req = {};
    const res = mockRes();

    prisma.class.findMany.mockResolvedValue([{ id: "1", name: "Yoga" }]);

    await getAllClasses(req, res);

    expect(prisma.class.findMany).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([{ id: "1", name: "Yoga" }]);
  });

  test("getClassById - not found", async () => {
    const req = { params: { id: "999" } };
    const res = mockRes();

    prisma.class.findUnique.mockResolvedValue(null);

    await getClassById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("updateClass - success", async () => {
    const req = {
      params: { id: "1" },
      body: { name: "Updated", description: "New", instructorId: "10" }
    };
    const res = mockRes();

    prisma.class.update.mockResolvedValue({ id: "1", ...req.body });

    await updateClass(req, res);

    expect(prisma.class.update).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  test("deleteClass - success", async () => {
    const req = { params: { id: "1" } };
    const res = mockRes();

    prisma.class.delete.mockResolvedValue(true);

    await deleteClass(req, res);

    expect(prisma.class.delete).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

});
