// src/routes.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SystemPage from "../pages/SystemPage";

function ClientRouter() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<SystemPage />} />
      </Routes>
    </Router>
  );
}

export default ClientRouter;
