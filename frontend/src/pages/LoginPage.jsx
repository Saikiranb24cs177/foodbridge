import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UtensilsCrossed, Lock, Mail, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    try {
      setIsLoading(true);
      const res = await login(email, password);
      showToast(`Welcome back, ${res.user.name}!`, 'success');

      if (from) {
        navigate(from, { replace: true });
      } else if (res.user.role === 'donor') {
        navigate('/donor/dashboard', { replace: true });
      } else if (res.user.role === 'ngo') {
        navigate('/ngo/dashboard', { replace: true });
      } else if (res.user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'donor') {
      setEmail('donor@foodbridge.org');
      setPassword('Password123!');
    } else if (role === 'ngo') {
      setEmail('ngo@foodbridge.org');
      setPassword('Password123!');
    } else if (role === 'admin') {
      setEmail('admin@foodbridge.org');
      setPassword('Password123!');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-warmth-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-brand-500/20">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign in to FoodBridge
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Access your donor dashboard, NGO claim feed, or admin console
          </p>
        </div>

        {/* Demo Account Quick-Fill Card */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Click to Autofill Demo Credentials:</span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => fillDemo('donor')}
              className="py-1.5 px-2 bg-white rounded-xl border border-amber-300 font-bold text-amber-800 hover:bg-amber-100 transition text-center shadow-xs"
            >
              Hotel Donor
            </button>
            <button
              type="button"
              onClick={() => fillDemo('ngo')}
              className="py-1.5 px-2 bg-white rounded-xl border border-amber-300 font-bold text-amber-800 hover:bg-amber-100 transition text-center shadow-xs"
            >
              NGO Shelter
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="py-1.5 px-2 bg-white rounded-xl border border-amber-300 font-bold text-amber-800 hover:bg-amber-100 transition text-center shadow-xs"
            >
              Admin HQ
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. chef@hotel.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Default: Password123!</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
