import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./components/Index";
import Image from "./components/Image";
import "./App.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/image" element={<Image />} />
    </Routes>
  </Router>
);
export default App;
