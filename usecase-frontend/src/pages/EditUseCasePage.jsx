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

  if (loading) return <p>Carregando caso de uso...</p>;
  if (error) return <p style={{ color: "red" }}>Erro: {error}</p>;

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto" }}>
      <UseCaseForm
        useCase={useCase}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
/*O componente EditUseCasePage é responsável por editar um caso de uso específico no sistema. Ele usa o ID presente na URL para buscar os dados do caso e exibe um formulário para edição. */
