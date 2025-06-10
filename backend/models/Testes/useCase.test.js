const { Sequelize } = require("sequelize");
const UseCaseModel = require("../useCase"); 

describe("Modelo UseCase", () => {
  test("deve ter nome da tabela 'use_case'", () => {
    expect(UseCaseModel.getTableName()).toBe("use_case");
  });

  test("deve ter todos os campos definidos", () => {
    const attributes = UseCaseModel.rawAttributes;

    const expectedFields = [
      "id",
      "title",
      "description",
      "actor",
      "preconditions",
      "postconditions",
      "main_flow",
      "alternative_flows",
      "exceptions",
      "created_by",
      "created_at",
      "updated_at",
    ];

    expectedFields.forEach((field) => {
      expect(attributes).toHaveProperty(field);
    });
  });
});
