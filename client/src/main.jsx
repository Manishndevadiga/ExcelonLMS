// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { Toaster } from "react-hot-toast";
import App from "./App";

import './index.css'

const theme = createTheme({
  palette: {
    primary: { main: "#4f46e5" },
    background: { default: "#f4f6fb" },
    text: { primary: "#111827", secondary: "#6b7280" },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif",
    button: { textTransform: "none", fontWeight: 600 },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <Toaster position="top-right" />
    </ThemeProvider>
  </StrictMode>
);