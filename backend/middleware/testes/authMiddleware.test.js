const jwt = require("jsonwebtoken");
const authenticateToken = require("../authMiddleware");

describe("Middleware authenticateToken", () => {
  const mockReq = () => ({
    headers: {},
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar 401 se não houver token", () => {
    const req = mockReq();
    const res = mockRes();

    authenticateToken(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token não fornecido." });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("deve retornar 403 se o token for inválido", () => {
    const req = {
      headers: {
        authorization: "Bearer token-invalido",
      },
    };
    const res = mockRes();

    jest
      .spyOn(jwt, "verify")
      .mockImplementation((token, secret, callback) =>
        callback(new Error("Token inválido"), null)
      );

    authenticateToken(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Token inválido." });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("deve chamar next() e anexar req.user se o token for válido", () => {
    const userPayload = { id: 1, role: "admin" };

    const req = {
      headers: {
        authorization: "Bearer token-valido",
      },
    };
    const res = mockRes();

    jest
      .spyOn(jwt, "verify")
      .mockImplementation((token, secret, callback) =>
        callback(null, userPayload)
      );

    authenticateToken(req, res, mockNext);

    expect(req.user).toEqual(userPayload);
    expect(mockNext).toHaveBeenCalled();
  });
});
