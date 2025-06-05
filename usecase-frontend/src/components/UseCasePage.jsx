import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import UseCaseForm from "./UseCaseForm";
import UseCaseHistoryModal from "./UseCaseHistoryModal";

export default function UseCasePage() {
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUseCase, setSelectedUseCase] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [role, setRole] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
    }

    fetchUseCases();
  }, []);

  const fetchUseCases = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/usecases`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao buscar casos de uso");

      const data = await response.json();
      setUseCases(data);
    } catch (err) {
      setError(err.message);
      setUseCases([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUseCases = useCases.filter((uc) =>
    uc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async (useCaseData) => {
    const method = useCaseData.id ? "PUT" : "POST";
    const url = useCaseData.id
      ? `${API_URL}/use-cases/${useCaseData.id}`
      : `${API_URL}/use-cases`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(useCaseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao salvar caso de uso");
      }

      setShowForm(false);
      setSelectedUseCase(null);
      await fetchUseCases();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este caso de uso?"))
      return;

    try {
      const response = await fetch(`${API_URL}/use-cases/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao excluir caso de uso");

      await fetchUseCases();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Casos de Uso</h2>

      <input
        type="text"
        placeholder="Buscar por título..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 10, width: "100%", padding: 6 }}
      />

      {(role === "admin" || role === "editor") && (
        <button
          onClick={() => {
            setSelectedUseCase(null);
            setShowForm(true);
          }}
          style={{ marginBottom: 10 }}
        >
          Novo Caso de Uso
        </button>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Carregando casos de uso...</p>
      ) : (
        <table border="1" cellPadding="6" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Título</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUseCases.length === 0 ? (
              <tr>
                <td colSpan="3">Nenhum caso de uso encontrado.</td>
              </tr>
            ) : (
              filteredUseCases.map((uc) => (
                <tr key={uc.id}>
                  <td>{uc.title}</td>
                  <td>{uc.description?.slice(0, 60)}...</td>
                  <td>
                    {(role === "admin" ||
                      (role === "editor" &&
                        uc.created_by ===
                          jwtDecode(localStorage.getItem("token")).id)) && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedUseCase(uc);
                            setShowForm(true);
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(uc.id)}
                          style={{ marginLeft: 6, color: "red" }}
                        >
                          Excluir
                        </button>
                      </>
                    )}
                    {role === "admin" && (
                      <button
                        onClick={() => {
                          setSelectedHistoryId(uc.id);
                          setShowHistoryModal(true);
                        }}
                        style={{ marginLeft: 6 }}
                      >
                        Ver Histórico
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {showForm && (
        <UseCaseForm
          useCase={selectedUseCase}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setSelectedUseCase(null);
          }}
        />
      )}

      {showHistoryModal && (
        <UseCaseHistoryModal
          useCaseId={selectedHistoryId}
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedHistoryId(null);
          }}
        />
      )}
    </div>
  );
}
/*O componente UseCasePage é a página principal de visualização, criação, edição e gerenciamento de casos de uso para usuários com acesso (admins, editores e visualizadores).  */
