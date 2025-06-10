const User = require("../user");

describe("Modelo User", () => {
  test("deve ter o nome da tabela 'users'", () => {
    expect(User.getTableName()).toBe("users");
  });

  test("deve conter todos os campos esperados", () => {
    const attributes = User.rawAttributes;

    const expectedFields = ["username", "email", "password", "role", "active"];

    expectedFields.forEach((field) => {
      expect(attributes).toHaveProperty(field);
    });
  });

  test("campo 'role' deve aceitar apenas 'admin', 'editor' ou 'visualizador'", () => {
    const roleValidation = User.rawAttributes.role.validate;

    expect(roleValidation).toHaveProperty("isIn");
    expect(roleValidation.isIn[0]).toEqual(
      expect.arrayContaining(["admin", "editor", "visualizador"])
    );
  });

  test("campo 'active' deve ter valor padrão false", () => {
    expect(User.rawAttributes.active.defaultValue).toBe(false);
  });

  test("campo 'role' deve ter valor padrão 'visualizador'", () => {
    expect(User.rawAttributes.role.defaultValue).toBe("visualizador");
  });
});
