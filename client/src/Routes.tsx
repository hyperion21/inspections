import type { JSX } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";

export const AppRoutes = {
  LOGIN: "/login",
  DASHBOARD: "/",
} as const;

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to={AppRoutes.LOGIN} replace />;
};

const AppRoutesComponent = () => {
  return (
    <Routes>
      <Route path={AppRoutes.LOGIN} element={<Login />} />

      {/* Protected Routes */}
      <Route
        path={AppRoutes.DASHBOARD}
        element={
          <ProtectedRoute>
            <></>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={AppRoutes.DASHBOARD} replace />} />
    </Routes>
  );
};

export default AppRoutesComponent;
