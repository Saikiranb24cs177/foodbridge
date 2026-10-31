import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Heart, ShieldCheck, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-warmth-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Food<span className="text-brand-400">Bridge</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              <span className="text-white font-semibold italic">“Turning Surplus Food into Hope.”</span>{' '}
              FoodBridge connects hotels, restaurants, hostels, and banquet halls with verified NGOs,
              orphanages, and shelters to ensure safe surplus food feeds hungry lives rather than landfills.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Food Safety Standards
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/donations" className="hover:text-white transition">
                  Browse Available Food
                </Link>
              </li>
              <li>
                <Link to="/donate" className="hover:text-white transition">
                  Donate Surplus Meals
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition">
                  How FoodBridge Works
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition">
                  Register as NGO / Donor
                </Link>
              </li>
            </ul>
          </div>

          {/* Dashboards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Portals
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/donor/dashboard" className="hover:text-white transition">
                  Food Donor Portal
                </Link>
              </li>
              <li>
                <Link to="/ngo/dashboard" className="hover:text-white transition">
                  NGO Request Feed
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-white transition">
                  Admin Governance
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Account Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Hunger Relief Hotline
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                <span>+91 (80) 4123-FOOD (24/7 Helpline)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                <span>rescue@foodbridge.org</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                <span>Bengaluru • Hyderabad • Mumbai • Delhi NCR</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FoodBridge Initiative. Zero Food Waste. Zero Hunger.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for community impact
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
