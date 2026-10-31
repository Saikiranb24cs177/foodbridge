import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  UtensilsCrossed,
  HeartHandshake,
  PlusCircle,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  ShieldAlert,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
  const { user, isAuthenticated, logout, isDonor, isNgo, isAdmin, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/');
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  const handleQuickDemo = async (role) => {
    try {
      let email = 'donor@foodbridge.org';
      if (role === 'ngo') email = 'ngo@foodbridge.org';
      if (role === 'admin') email = 'admin@foodbridge.org';

      await login(email, 'Password123!');
      showToast(`Logged in as Demo ${role.toUpperCase()}!`, 'success');
      setDemoDropdownOpen(false);
      setMobileMenuOpen(false);

      if (role === 'donor') navigate('/donor/dashboard');
      else if (role === 'ngo') navigate('/ngo/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
    } catch {
      showToast('Failed to log in with demo account', 'error');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Tagline */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-warmth-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
              <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
                  Food<span className="text-brand-600">Bridge</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-warmth-500 animate-pulse" />
              </div>
              <span className="hidden sm:block text-[11px] font-medium text-slate-500 -mt-1 tracking-tight">
                Turning Surplus Food into Hope
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/donations"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                location.pathname === '/donations'
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Browse Food
            </Link>

            <Link
              to="/how-it-works"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                location.pathname === '/how-it-works'
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              How It Works
            </Link>

            {/* Role specific quick dashboard links */}
            {isDonor && (
              <Link
                to="/donor/dashboard"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 ${
                  location.pathname.startsWith('/donor')
                    ? 'text-brand-700 bg-brand-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-brand-600" />
                <span>Donor Dashboard</span>
              </Link>
            )}

            {isNgo && (
              <Link
                to="/ngo/dashboard"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 ${
                  location.pathname.startsWith('/ngo')
                    ? 'text-brand-700 bg-brand-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <HeartHandshake className="w-4 h-4 text-brand-600" />
                <span>NGO Portal</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 ${
                  location.pathname.startsWith('/admin')
                    ? 'text-amber-800 bg-amber-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Admin Panel</span>
              </Link>
            )}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition flex items-center gap-1.5"
                title="Quickly test with seeded accounts"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Demo Accounts</span>
                <ChevronDown className="w-3 h-3 text-amber-600" />
              </button>

              {demoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1">
                    Instant 1-Click Login
                  </div>
                  <button
                    onClick={() => handleQuickDemo('donor')}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700 rounded-xl transition flex items-center justify-between"
                  >
                    <span>Chef Vikram (Donor)</span>
                    <span className="text-[10px] text-brand-600 font-bold bg-brand-100 px-1.5 py-0.5 rounded">
                      Hotel
                    </span>
                  </button>
                  <button
                    onClick={() => handleQuickDemo('ngo')}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700 rounded-xl transition flex items-center justify-between"
                  >
                    <span>Rajeshwari (NGO)</span>
                    <span className="text-[10px] text-blue-600 font-bold bg-blue-100 px-1.5 py-0.5 rounded">
                      Shelter
                    </span>
                  </button>
                  <button
                    onClick={() => handleQuickDemo('admin')}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700 rounded-xl transition flex items-center justify-between"
                  >
                    <span>Administrator</span>
                    <span className="text-[10px] text-amber-600 font-bold bg-amber-100 px-1.5 py-0.5 rounded">
                      HQ
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Donate food CTA button */}
            <Link
              to="/donate"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 hover:shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Donate Food</span>
            </Link>

            {/* User Profile / Auth buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition focus:outline-none"
                >
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      {user?.name?.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium capitalize">
                      {user?.role}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs border border-brand-200">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.organizationName}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">
                        {user?.role}
                      </span>
                    </div>

                    {isDonor && (
                      <Link
                        to="/donor/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        <span>Donor Dashboard</span>
                      </Link>
                    )}

                    {isNgo && (
                      <Link
                        to="/ngo/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
                      >
                        <HeartHandshake className="w-4 h-4 text-slate-400" />
                        <span>NGO Portal</span>
                      </Link>
                    )}

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
                      >
                        <ShieldAlert className="w-4 h-4 text-slate-400" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-sm transition"
                >
                  Join Us
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => handleQuickDemo('donor')}
              className="p-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg"
              title="Demo Donor"
            >
              Demo
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col gap-1">
            <Link
              to="/donations"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Browse Surplus Food
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              How FoodBridge Works
            </Link>
            <Link
              to="/donate"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-sm font-bold text-brand-600 bg-brand-50"
            >
              + Donate Food Now
            </Link>

            {isDonor && (
              <Link
                to="/donor/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Donor Dashboard
              </Link>
            )}

            {isNgo && (
              <Link
                to="/ngo/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                NGO Dashboard & Requests
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Admin Control Panel
              </Link>
            )}
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role} • {user?.organizationName}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 rounded-xl"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-bold border border-slate-300 rounded-xl text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-bold bg-brand-600 text-white rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
