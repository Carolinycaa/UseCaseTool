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

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.actor.trim() ||
      !formData.preconditions.trim() ||
      !formData.postconditions.trim() ||
      !formData.main_flow.trim() ||
      !formData.alternative_flows.trim()
    ) {
      setError("Preencha todos os campos obrigatórios.");
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
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={styles.title}>
        {useCase ? "Editar Caso de Uso" : "Novo Caso de Uso"}
      </h3>

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
        <div key={name} style={styles.inputGroup}>
          <label htmlFor={name} style={styles.label}>
            {label}:
          </label>
          {multiline ? (
            <textarea
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              disabled={isDisabled}
              rows={4}
              style={styles.input}
            />
          ) : (
            <input
              type="text"
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              disabled={isDisabled}
              style={styles.input}
            />
          )}
        </div>
      ))}

      {error && <p style={styles.error}>{error}</p>}

      {!readOnly && (
        <div style={styles.buttonGroup}>
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              backgroundColor: "#6c3fc9",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              ...styles.button,
              backgroundColor: "#6c757d",
              marginLeft: "10px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Cancelar
          </button>
        </div>
      )}
    </form>
  );
}

const styles = {
  form: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  },
  title: {
    fontSize: "20px",
    marginBottom: "20px",
    color: "#6c3fc9",
  },
  inputGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    color: "#555",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },
  error: {
    color: "#d9534f",
    marginTop: "10px",
    fontWeight: "600",
    fontSize: "14px",
    textAlign: "center",
  },
  buttonGroup: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "flex-start",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontWeight: "600",
    fontSize: "15px",
    transition: "background-color 0.3s",
  },
};
