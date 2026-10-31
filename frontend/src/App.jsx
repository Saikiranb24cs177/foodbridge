import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FoodListingsPage from './pages/FoodListingsPage';
import DonationDetailPage from './pages/DonationDetailPage';
import DonateFoodPage from './pages/DonateFoodPage';
import DonorDashboard from './pages/DonorDashboard';
import NgoDashboard from './pages/NgoDashboard';
import AdminDashboard from './pages/AdminDashboard';
import HowItWorksPage from './pages/HowItWorksPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-brand-500 selection:text-white">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/donations" element={<FoodListingsPage />} />
                <Route path="/donations/:id" element={<DonationDetailPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />

                {/* Donor Protected Routes */}
                <Route
                  path="/donate"
                  element={
                    <ProtectedRoute allowedRoles={['donor', 'admin']}>
                      <DonateFoodPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/donor/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['donor', 'admin']}>
                      <DonorDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* NGO Protected Routes */}
                <Route
                  path="/ngo/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['ngo', 'admin']}>
                      <NgoDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
