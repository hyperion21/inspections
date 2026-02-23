import type { JSX } from "react";
import { Container, Spinner } from "react-bootstrap";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/login/LoginPage";
import ProfilePage from "./pages/profile/ProfilePage";

export const AppRoutes = {
  LOGIN: "/login",
  INSPECTIONS: "/",
  PROFILE: "/me",
} as const;

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, initialized } = useAuth();

  if (!initialized) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return isAuthenticated ? children : <Navigate to={AppRoutes.LOGIN} replace />;
};

const AppRoutesComponent = () => {
  return (
    <Routes>
      <Route path={AppRoutes.LOGIN} element={<LoginPage />} />

      <Route
        path={AppRoutes.INSPECTIONS}
        element={
          <ProtectedRoute>
            <></>
          </ProtectedRoute>
        }
      />
      <Route
        path={AppRoutes.PROFILE}
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to={AppRoutes.INSPECTIONS} replace />}
      />
    </Routes>
  );
};

export default AppRoutesComponent;
