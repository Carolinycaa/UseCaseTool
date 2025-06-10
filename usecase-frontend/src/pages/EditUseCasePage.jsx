import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UseCaseForm from "../components/UseCaseForm";

const API_URL = process.env.REACT_APP_API_URL;

export default function EditUseCasePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [useCase, setUseCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUseCase = async () => {
      try {
        const res = await fetch(`${API_URL}/use-cases/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao carregar o caso de uso");

        const data = await res.json();
        setUseCase(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUseCase();
  }, [id, token]);

  const handleSave = async (updatedData) => {
    const res = await fetch(`${API_URL}/use-cases/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) throw new Error("Erro ao atualizar o caso de uso");

    alert("Caso de uso atualizado com sucesso!");
    navigate("/admin/usecases");
  };

  const handleCancel = () => {
    navigate("/admin/usecases");
  };

  if (loading)
    return <p style={styles.loadingText}>Carregando caso de uso...</p>;

  if (error) return <p style={styles.errorText}>Erro: {error}</p>;

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <UseCaseForm
          useCase={useCase}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}

// 🎨 Estilos harmonizados
const styles = {
  wrapper: {
    backgroundColor: "#f6f1fc",
    minHeight: "100vh",
    padding: "50px 20px",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
  },
  loadingText: {
    textAlign: "center",
    marginTop: "100px",
    fontSize: "18px",
    color: "#6c3fc9",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  },
  errorText: {
    textAlign: "center",
    marginTop: "100px",
    fontSize: "16px",
    color: "#d9534f",
    fontWeight: "600",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  },
};
