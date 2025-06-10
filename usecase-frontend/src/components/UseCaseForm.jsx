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
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 12px 32px rgba(108, 63, 201, 0.08)",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    maxWidth: "820px",
    margin: "40px auto",
    border: "1px solid #eee",
  },
  title: {
    fontSize: "26px",
    marginBottom: "30px",
    color: "#6c3fc9",
    textAlign: "center",
    fontWeight: "700",
  },
  inputGroup: {
    marginBottom: "24px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    color: "#444",
    fontSize: "15px",
  },
  input: {
    width: "100%",
    padding: "13px 16px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
    backgroundColor: "#f8f6ff",
    transition: "border-color 0.2s",
  },
  error: {
    color: "#dc3545",
    marginTop: "14px",
    fontWeight: "600",
    fontSize: "14px",
    textAlign: "center",
  },
  buttonGroup: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
    gap: "16px",
  },
  button: {
    padding: "12px 28px",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontWeight: "600",
    fontSize: "15px",
    transition: "all 0.3s ease",
  },
};
