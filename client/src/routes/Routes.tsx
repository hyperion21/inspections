import { Navigate, Route, Routes } from "react-router-dom";
import EmployeePage from "../pages/employee/EmployeePage";
import LoginPage from "../pages/login/LoginPage";
import ProfilePage from "../pages/profile/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";

export const AppRoutes = {
  LOGIN: "/login",
  INSPECTIONS: "/",
  PROFILE: "/me",
  EMPLOYEES: "/employees",
} as const;

const AppRoutesComponent = () => {
  return (
    <Routes>
      <Route path={AppRoutes.LOGIN} element={<LoginPage />} />

      {/* All authenticated routes */}
      <Route element={<ProtectedRoute />}>
        <Route path={AppRoutes.INSPECTIONS} element={<div>Inspections</div>} />
        <Route path={AppRoutes.PROFILE} element={<ProfilePage />} />
      </Route>

      {/* Manager-only routes */}
      <Route element={<ProtectedRoute allowedRoles={["MANAGER"]} />}>
        <Route path={AppRoutes.EMPLOYEES} element={<EmployeePage />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={AppRoutes.INSPECTIONS} replace />}
      />
    </Routes>
  );
};

export default AppRoutesComponent;
