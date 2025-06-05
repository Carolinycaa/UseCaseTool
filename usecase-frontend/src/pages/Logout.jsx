import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove o token do localStorage
    localStorage.removeItem("token");

    // Redireciona após 1 segundo
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 1000);

    return () => clearTimeout(timer); // Limpa o timer se o componente desmontar
  }, [navigate]);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#333",
      }}
    >
      <h2 style={{ marginBottom: "10px" }}>Saindo da conta...</h2>
      <p>Você será redirecionado para a página inicial.</p>
    </div>
  );
}
