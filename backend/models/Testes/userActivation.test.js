const UserActivation = require("../userActivation");

describe("Modelo UserActivation", () => {
  test("deve ter o nome da tabela 'userActivation'", () => {
    expect(UserActivation.getTableName()).toBe("userActivation");
  });

  test("deve conter todos os campos esperados", () => {
    const attributes = UserActivation.rawAttributes;

    const expectedFields = [
      "id",
      "userId",
      "activationCode",
      "createdAt",
      "updatedAt",
    ];

    expectedFields.forEach((field) => {
      expect(attributes).toHaveProperty(field);
    });
  });

  test("campo 'userId' deve ser obrigatório", () => {
    expect(UserActivation.rawAttributes.userId.allowNull).toBe(false);
  });

  test("campo 'activationCode' deve ser obrigatório", () => {
    expect(UserActivation.rawAttributes.activationCode.allowNull).toBe(false);
  });

  test("campos 'createdAt' e 'updatedAt' devem ter valor padrão definido", () => {
    expect(UserActivation.rawAttributes.createdAt.defaultValue).toBeDefined();
    expect(UserActivation.rawAttributes.updatedAt.defaultValue).toBeDefined();
  });

  test("timestamps devem estar ativados", () => {
    expect(UserActivation.options.timestamps).toBe(true);
  });

  test("underscored deve estar desativado", () => {
    expect(UserActivation.options.underscored).toBe(false);
  });
});
