import React, { useState, useEffect } from "react";

export default function UseCaseForm({
  useCase,
  onSave,
  onCancel,
  readOnly = false,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    actor: "",
    preconditions: "",
    postconditions: "",
    main_flow: "",
    alternative_flows: "",
    exceptions: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (useCase) {
      setFormData({
        title: useCase.title || "",
        description: useCase.description || "",
        actor: useCase.actor || "",
        preconditions: useCase.preconditions || "",
        postconditions: useCase.postconditions || "",
        main_flow: useCase.main_flow || "",
        alternative_flows: useCase.alternative_flows || "",
        exceptions: useCase.exceptions || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        actor: "",
        preconditions: "",
        postconditions: "",
        main_flow: "",
        alternative_flows: "",
        exceptions: "",
      });
    }
    setError("");
  }, [useCase]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Título e descrição são obrigatórios.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSave({ ...formData, id: useCase?.id });
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || readOnly;

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "#f9f9f9",
        border: "1px solid #ddd",
        padding: 24,
        borderRadius: 12,
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
        marginTop: 20,
      }}
    >
      <h3 style={{ marginBottom: 20 }}>
        {useCase ? "Editar Caso de Uso" : "Novo Caso de Uso"}
      </h3>

      {/* Campos dinâmicos */}
      {[
        { label: "Título", name: "title" },
        { label: "Descrição", name: "description", multiline: true },
        { label: "Ator", name: "actor" },
        { label: "Pré-condições", name: "preconditions", multiline: true },
        { label: "Pós-condições", name: "postconditions", multiline: true },
        { label: "Fluxo principal", name: "main_flow", multiline: true },
        {
          label: "Fluxos alternativos",
          name: "alternative_flows",
          multiline: true,
        },
        { label: "Exceções", name: "exceptions", multiline: true },
      ].map(({ label, name, multiline }) => (
        <div key={name} style={{ marginBottom: 16 }}>
          <label htmlFor={name}>
            <strong>{label}:</strong>
          </label>
          <br />
          {multiline ? (
            <textarea
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              disabled={isDisabled}
              rows={4}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />
          ) : (
            <input
              type="text"
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              disabled={isDisabled}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />
          )}
        </div>
      ))}

      {/* Mensagem de erro */}
      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

      {/* Botões */}
      {!readOnly && (
        <div style={{ marginTop: 20 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "10px 16px",
              border: "none",
              borderRadius: 6,
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              marginLeft: 10,
              backgroundColor: "#6c757d",
              color: "#fff",
              padding: "10px 16px",
              border: "none",
              borderRadius: 6,
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            Cancelar
          </button>
        </div>
      )}
    </form>
  );
}
