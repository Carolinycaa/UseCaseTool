import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import UseCaseForm from "../components/UseCaseForm";

const API_URL = process.env.REACT_APP_API_URL;

export default function CreateUseCasePage() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch {
        setRole(null);
      }
    }
  }, [token]);

  const handleSave = async (formData) => {
    try {
      const res = await fetch(`${API_URL}/use-cases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao criar caso de uso");
      }

      alert("Caso de uso criado com sucesso!");
      navigate(role === "admin" ? "/admin/usecases" : "/use-cases");
    } catch (err) {
      alert(err.message);
    }
  };

  if (role !== "admin" && role !== "editor") {
    return (
      <div style={styles.wrapper}>
        <p style={styles.errorMsg}>
          Você não tem permissão para acessar esta página.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <UseCaseForm onSave={handleSave} onCancel={() => navigate(-1)} />
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    background: "linear-gradient(to right, #f6f1fc, #fdfbff)",
    minHeight: "100vh",
    padding: "60px 20px",
    fontFamily: "'Poppins', sans-serif",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    background: "#ffffff",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 12px 28px rgba(0, 0, 0, 0.08)",
  },
  errorMsg: {
    color: "#dc3545",
    fontWeight: "600",
    fontSize: "16px",
    textAlign: "center",
    padding: "60px 20px",
    fontFamily: "'Poppins', sans-serif",
  },
};
