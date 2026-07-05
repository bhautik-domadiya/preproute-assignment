import { Route, Routes } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import LoginPage from "@/pages/Login/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import DashboardPage from "@/pages/Dashboard/DashboardPage";
import CreateTestPage from "@/pages/CreateTest/CreateTestPage";
import EditTestPage from "@/pages/EditTest/EditTestPage";
import QuestionsPage from "@/pages/Questions/QuestionsPage";
import PreviewPage from "@/pages/Preview/PreviewPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tests/new" element={<CreateTestPage />} />
          <Route path="/tests/:id/edit" element={<EditTestPage />} />
          <Route path="/tests/:id/questions" element={<QuestionsPage />} />
          <Route path="/tests/:id/preview" element={<PreviewPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
