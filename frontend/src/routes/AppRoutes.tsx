import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import AuthPage from "../pages/auth/AuthPage";
import OtpPage from "../pages/auth/OtpPage";
import LandingPage from "../pages/landing";
import AboutPage from "../pages/landing/About";
import ContactPage from "../pages/landing/Contact";
import AdminDashboard from "../pages/admin/Dashboard";
import ComplaintDetails from "../pages/citizen/ComplaintDetails";
import DashboardShell from "../components/layout/DashboardShell";
import DashboardHome from "../pages/citizen/dashboard/DashboardHome";
import MyComplaintsView from "../pages/citizen/dashboard/views/MyComplaintsView";
import NewComplaintView from "../pages/citizen/dashboard/views/NewComplaintView";
import LiveMapView from "../pages/citizen/dashboard/views/LiveMapView";
import NotificationsView from "../pages/citizen/dashboard/views/NotificationsView";
import MessagesView from "../pages/citizen/dashboard/views/MessagesView";
import ProfileView from "../pages/citizen/dashboard/views/ProfileView";
import SettingsView from "../pages/citizen/dashboard/views/SettingsView";
import HelpView from "../pages/citizen/dashboard/views/HelpView";
import TechnicianDashboard from "../pages/technician/Dashboard";
import NotFound from "../pages/NotFound";
import ErrorBoundary from "../components/ErrorBoundary";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/:role/:mode" element={<AuthPage />} />
        <Route path="/otp-verify" element={<OtpPage />} />

        {/* Legacy redirects */}
        <Route path="/complaints" element={<Navigate to="/dashboard/complaints" replace />} />
        <Route path="/new-complaint" element={<Navigate to="/dashboard/new-complaint" replace />} />
        <Route path="/map" element={<Navigate to="/dashboard/map" replace />} />

        {/* Citizen SPA Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["citizen"]}>
              <ErrorBoundary>
                <DashboardShell />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="complaints" element={<MyComplaintsView />} />
          <Route path="new-complaint" element={<NewComplaintView />} />
          <Route path="map" element={<LiveMapView />} />
          <Route path="notifications" element={<NotificationsView />} />
          <Route path="messages" element={<MessagesView />} />
          <Route path="profile" element={<ProfileView />} />
          <Route path="settings" element={<SettingsView />} />
          <Route path="help" element={<HelpView />} />
        </Route>

        <Route
          path="/complaints/:id"
          element={
            <ProtectedRoute roles={["citizen", "admin", "technician"]}>
              <ErrorBoundary>
                <ComplaintDetails />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["admin"]}>
              <ErrorBoundary>
                <AdminDashboard />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path="/technician/dashboard"
          element={
            <ProtectedRoute roles={["technician"]}>
              <ErrorBoundary>
                <TechnicianDashboard />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

