// Mocka os modelos
jest.mock("../user", () => ({
  hasMany: jest.fn(),
}));
jest.mock("../useCase", () => ({
  belongsTo: jest.fn(),
}));
jest.mock("../useCaseHistory", () => ({
  belongsTo: jest.fn(),
}));

const User = require("../user");
const UseCase = require("../useCase");
const UseCaseHistory = require("../useCaseHistory");

// Importa o arquivo de associação após mocks estarem prontos
require("../associations");

describe("Associações entre modelos", () => {
  test("UseCase.belongsTo(User) com alias 'creator'", () => {
    expect(UseCase.belongsTo).toHaveBeenCalledWith(User, {
      foreignKey: "created_by",
      as: "creator",
    });
  });

  test("User.hasMany(UseCase) com alias 'createdUseCases'", () => {
    expect(User.hasMany).toHaveBeenCalledWith(UseCase, {
      foreignKey: "created_by",
      as: "createdUseCases",
    });
  });

  test("UseCaseHistory.belongsTo(User) com alias 'editor'", () => {
    expect(UseCaseHistory.belongsTo).toHaveBeenCalledWith(User, {
      foreignKey: "edited_by",
      as: "editor",
    });
  });
});
