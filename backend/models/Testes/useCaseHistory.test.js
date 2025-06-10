const UseCaseHistory = require("../useCaseHistory");

describe("Modelo UseCaseHistory", () => {
  test("deve ter o nome da tabela 'use_case_history'", () => {
    expect(UseCaseHistory.getTableName()).toBe("use_case_history");
  });

  test("deve conter todos os campos esperados", () => {
    const attributes = UseCaseHistory.rawAttributes;

    const expectedFields = [
      "id",
      "use_case_id",
      "title",
      "description",
      "actor",
      "preconditions",
      "postconditions",
      "main_flow",
      "alternative_flows",
      "exceptions",
      "edited_by",
      "edited_at",
      "createdAt",
      "updatedAt",
    ];

    expectedFields.forEach((field) => {
      expect(attributes).toHaveProperty(field);
    });
  });
});
