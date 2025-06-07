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
    <div style={styles.container}>
      <UseCaseForm
        useCase={useCase}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "720px",
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  },
  loadingText: {
    textAlign: "center",
    marginTop: "80px",
    fontSize: "18px",
    color: "#6c3fc9",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  },
  errorText: {
    textAlign: "center",
    marginTop: "80px",
    fontSize: "16px",
    color: "#d9534f",
    fontWeight: "600",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  },
};
