import { render, screen } from "@testing-library/react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

test("renderiza o componente App", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  const loginElements = screen.getAllByText(/login/i);
  expect(loginElements.length).toBeGreaterThanOrEqual(1);
});
