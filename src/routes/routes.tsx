import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Profile from "../pages/Profile";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: 'perfil', element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: 'login', element: <Login /> }
    ],
  },
]);
