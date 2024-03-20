import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Products from "../pages/Products";
import NewProduct from "../pages/NewProduct";
import EditProduct from "../pages/EditProduct";
import StockManagement from "../pages/StockManagement";
import SchoolsUnits from "../pages/SchoolsUnits";
import Stocks from "../pages/Stocks";
import EditStock from "../pages/EditStock";

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
      { path: 'gerenciamento', element: <ProtectedRoute><StockManagement /></ProtectedRoute> },
      { path: 'gerenciamento/unidades-escolares', element: <ProtectedRoute><SchoolsUnits /></ProtectedRoute> },
      { path: 'gerenciamento/estoques', element: <ProtectedRoute><Stocks /></ProtectedRoute> },
      { path: 'gerenciamento/unidades-escolares/:id/estoque', element: <ProtectedRoute><EditStock /></ProtectedRoute> },
    ],
  },
]);
