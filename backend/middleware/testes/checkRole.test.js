const checkRole = require("../checkRole");

describe("Middleware checkRole", () => {
  const mockNext = jest.fn();
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    mockNext.mockClear();
  });

  test("deve retornar 401 se req.user não existir", () => {
    const req = {};
    const res = mockRes();

    const middleware = checkRole(["admin"]);
    middleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Usuário não autenticado.",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test("deve retornar 403 se role não for permitida", () => {
    const req = { user: { role: "editor" } };
    const res = mockRes();

    const middleware = checkRole(["admin"]);
    middleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Acesso negado." });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test("deve chamar next() se role for permitida", () => {
    const req = { user: { role: "admin" } };
    const res = mockRes();

    const middleware = checkRole(["admin", "editor"]);
    middleware(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
