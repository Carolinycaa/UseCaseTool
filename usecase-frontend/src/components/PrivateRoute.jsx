import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function PrivateRoute({ children, roles }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    if (roles && !roles.includes(decoded.role)) {
      // Usuário não tem permissão para essa rota
      return <Navigate to="/unauthorized" replace />;
    }
  } catch {
    return <Navigate to="/" replace />;
  }

  return children;
}
/*Esse componente PrivateRoute é um middleware de rota no frontend (React Router), usado para proteger páginas privadas — ou seja, que exigem autenticação e, opcionalmente, um papel específico (como admin, editor, etc.). */
