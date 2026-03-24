import { createRoot } from "react-dom/client";
import axios from 'axios';
import App from "./App.jsx";
import "./index.css";

axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

createRoot(document.getElementById("root")).render(<App />);