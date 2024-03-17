import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Products from "../pages/Products";
import NewProduct from "../pages/NewProduct";
import EditProduct from "../pages/EditProduct";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: 'perfil', element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: 'login', element: <Login /> },
      { path: 'produtos', element: <ProtectedRoute><Products /></ProtectedRoute> },
      { path: 'produtos/novo', element: <ProtectedRoute><NewProduct /></ProtectedRoute> },
      { path: 'produtos/:id', element: <ProtectedRoute><EditProduct /></ProtectedRoute> },
    ],
  },
]);
