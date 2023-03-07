import React from "react";
import "./App.css";
import { HomePage } from "./layout/HomePage/HomePage";
import { Footer } from "./layout/NavbarandFooter/Footer";
import { Navbar } from "./layout/NavbarandFooter/Navbar";

export const App = () => {
  return (
    <div>
      <Navbar />
      <HomePage />
      <Footer />
    </div>
  );
};
