import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;

  try {
    const decoded = jwtDecode(token);
    if (decoded.role !== "admin") {
      return <Navigate to="/dashboard" replace />;
    }
  } catch {
    return <Navigate to="/" replace />;
  }

  return children;
}
/*Esse componente AdminRoute é uma proteção de rota (route guard) no React Router, usado para garantir que apenas usuários com papel admin consigam acessar determinadas páginas no frontend. */
