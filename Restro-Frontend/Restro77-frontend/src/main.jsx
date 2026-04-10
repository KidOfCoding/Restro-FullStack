import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import StoreContextProvider from "./context/StoreContext.jsx";
import { ToastContainer, toast } from 'react-toastify';
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StoreContextProvider>
      
      <App />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </StoreContextProvider>
  </BrowserRouter>
);
