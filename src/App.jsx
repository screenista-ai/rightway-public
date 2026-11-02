import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AtsCheckerPage from './pages/AtsCheckerPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PrivacyPage from './pages/legal/PrivacyPage';
import TermsPage from './pages/legal/TermsPage';
import PortalLayout from './pages/portal/PortalLayout';
import DashboardPage from './pages/portal/DashboardPage';
import ProfilePage from './pages/portal/ProfilePage';
import DocumentsPage from './pages/portal/DocumentsPage';
import CvBuilderPage from './pages/portal/CvBuilderPage';
import JobsPage from './pages/portal/JobsPage';
import ApplicationsPage from './pages/portal/ApplicationsPage';
import SettingsPage from './pages/portal/SettingsPage';
import RecruiterLayout from './pages/recruiter/RecruiterLayout';
import RecruiterDashboardPage from './pages/recruiter/RecruiterDashboardPage';
import RecruiterJobsPage from './pages/recruiter/RecruiterJobsPage';
import RecruiterPostJobPage from './pages/recruiter/RecruiterPostJobPage';
import RecruiterTalentPage from './pages/recruiter/RecruiterTalentPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminSectionPage from './pages/admin/AdminSectionPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/ats-checker" element={<AtsCheckerPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/legal/gdpr-privacy" element={<PrivacyPage />} />
      <Route path="/legal/terms" element={<TermsPage />} />

      {/* Candidate Portal Routes */}
      <Route path="/portal" element={<PortalLayout />}>
        <Route index element={<Navigate to="/portal/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="cv-builder" element={<Navigate to="/portal/resumes" replace />} />
        <Route path="resumes" element={<CvBuilderPage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Recruiter Portal Routes */}
      <Route path="/recruiter" element={<RecruiterLayout />}>
        <Route index element={<Navigate to="/recruiter/dashboard" replace />} />
        <Route path="dashboard" element={<RecruiterDashboardPage />} />
        <Route path="jobs" element={<RecruiterJobsPage />} />
        <Route path="post-job" element={<RecruiterPostJobPage />} />
        <Route path="talent-pool" element={<RecruiterTalentPage />} />
      </Route>

      {/* Admin / Sub-Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path=":section" element={<AdminSectionPage />} />
      </Route>

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
