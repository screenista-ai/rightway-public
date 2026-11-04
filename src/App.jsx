import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import AtsCheckerPage from './pages/AtsCheckerPage';
import CountriesPage from './pages/CountriesPage';
import WhyPage from './pages/WhyPage';
import EmployersPage from './pages/EmployersPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PrivacyPage from './pages/legal/PrivacyPage';
import TermsPage from './pages/legal/TermsPage';
import SecurityPage from './pages/legal/SecurityPage';

/**
 * Ensures each navigation click opens the new page at the top,
 * never preserving prior scroll offsets or scrolling down in-page.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

/**
 * Public marketing & platform exploration — rightway.ai
 * NextRaise-Grade Navigation Architecture:
 * Every nav link opens its own dedicated, rich, responsive page.
 */
export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Primary Navigation Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/find-jobs" element={<Navigate to="/jobs" replace />} />
        <Route path="/ats-checker" element={<AtsCheckerPage />} />
        <Route path="/countries" element={<CountriesPage />} />
        <Route path="/why-rightway" element={<WhyPage />} />
        <Route path="/why" element={<Navigate to="/why-rightway" replace />} />
        <Route path="/how-it-works" element={<Navigate to="/why-rightway" replace />} />
        <Route path="/pricing" element={<Navigate to="/" replace />} />
        <Route path="/employers" element={<EmployersPage />} />

        {/* Trust & Legal */}
        <Route path="/legal/gdpr-privacy" element={<PrivacyPage />} />
        <Route path="/legal/terms" element={<TermsPage />} />
        <Route path="/legal/security" element={<SecurityPage />} />

        {/* Auth */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        {/* Wildcard Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
