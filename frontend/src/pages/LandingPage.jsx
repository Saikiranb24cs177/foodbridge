import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  HeartHandshake,
  ShieldCheck,
  Truck,
  ArrowRight,
  Users,
  Building,
  CheckCircle2,
  Sparkles,
  Leaf,
  Clock,
  Heart,
  Quote,
  Flame,
  Coffee,
} from 'lucide-react';
import { statsService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LandingPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState({
    verifiedMealsDelivered: 90,
    estimatedMealsOffered: 385,
    totalDonations: 5,
    participatingDonors: 3,
    participatingNgos: 3,
    estimatedKgFoodSaved: 36,
    estimatedCo2SavedKg: 68,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await statsService.getPlatformStats();
        if (res.data) {
          setStats({
            ...res.data.verified,
            ...res.data.estimates,
          });
        }
      } catch (err) {
        console.warn('Using baseline stats', err);
      }
    };
    fetchStats();
  }, []);

  const handleQuickDemo = async (role) => {
    try {
      let email = 'donor@foodbridge.org';
      if (role === 'ngo') email = 'ngo@foodbridge.org';
      if (role === 'admin') email = 'admin@foodbridge.org';
      await login(email, 'Password123!');
      showToast(`Logged in as Demo ${role.toUpperCase()}!`, 'success');
    } catch {
      showToast('Demo login failed', 'error');
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Background glow & gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-40">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-brand-400 rounded-full blur-[120px] mix-blend-multiply" />
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-warmth-400 rounded-full blur-[120px] mix-blend-multiply" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading, Tagline, CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Mission Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Zero Hunger • Zero Food Waste Network</span>
              </div>

              {/* Main Headline & Tagline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Turning Surplus Food into{' '}
                <span className="bg-gradient-to-r from-brand-600 via-emerald-600 to-warmth-600 bg-clip-text text-transparent">
                  Hope.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                FoodBridge connects hotels, restaurants, hostels, and function halls with verified NGOs,
                orphanages, and community shelters. Seamlessly rescue fresh surplus meals in real-time.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/donate"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-xl shadow-brand-600/25 hover:shadow-brand-600/40 transition-all flex items-center justify-center gap-2 group"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Donate Food</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/donations"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-sm hover:shadow transition flex items-center justify-center gap-2"
                >
                  <HeartHandshake className="w-4 h-4 text-brand-600" />
                  <span>Find Food</span>
                </Link>

                <Link
                  to="/register"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-warmth-500 hover:bg-warmth-600 text-slate-900 font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>Join Us</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  100% Verified Food Safety Protocol
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-600" />
                  Real-time Matching & ETA
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-warmth-600" />
                  Verified NGOs & Shelters
                </span>
              </div>

              {/* Demo Quick Bar */}
              <div className="pt-4 p-3 rounded-2xl bg-slate-100/80 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 max-w-xl mx-auto lg:mx-0">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Explore with 1-Click Demo Accounts:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleQuickDemo('donor')}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:border-brand-500 hover:text-brand-600 transition"
                  >
                    Hotel Donor
                  </button>
                  <button
                    onClick={() => handleQuickDemo('ngo')}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 transition"
                  >
                    NGO Shelter
                  </button>
                  <button
                    onClick={() => handleQuickDemo('admin')}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:border-amber-500 hover:text-amber-600 transition"
                  >
                    Admin
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Image Card */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80"
                    alt="Volunteers packaging nutritious food for donation"
                    className="w-full h-80 sm:h-96 object-cover"
                  />
                  <div className="p-5 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                        Live Food Rescue
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        Delivered Safely
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      80 Servings of Royal Biryani & Paneer Curry
                    </h4>
                    <p className="text-xs text-slate-500">
                      Grand Royal Hotel ➔ Hope Child Care & Orphanage
                    </p>
                  </div>
                </div>

                {/* Floating Metric Badge 1 */}
                <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce [animation-duration:3s]">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Waste Prevented</p>
                    <p className="text-sm font-extrabold text-slate-900">
                      {stats.estimatedKgFoodSaved || 36}+ kg Rescued
                    </p>
                  </div>
                </div>

                {/* Floating Metric Badge 2 */}
                <div className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warmth-100 flex items-center justify-center text-warmth-600">
                    <Heart className="w-5 h-5 fill-warmth-500" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Verified Meals</p>
                    <p className="text-sm font-extrabold text-slate-900">
                      {stats.verifiedMealsDelivered || 90}+ Nourished
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW FOODBRIDGE WORKS IN 3 SIMPLE STEPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How FoodBridge Bridges the Gap
          </h2>
          <p className="text-base text-slate-600">
            A reliable, transparent workflow ensuring surplus food reaches verified beneficiaries before it spoils.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all relative group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 font-extrabold text-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Donors List Surplus</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Hotels, restaurants, or event halls specify quantity, servings, safe consumption deadline,
                and pickup window. A strict hygiene safety certification is mandated.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-brand-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>Safety Declaration Required</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all relative group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-warmth-50 border border-warmth-200 text-warmth-700 font-extrabold text-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">NGOs Claim & Match</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Nearby verified shelters, orphanages, and relief charities receive instant alerts, review food details,
                and submit a pickup claim with volunteer and vehicle details.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-warmth-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>4-Digit Pickup PIN Verification</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all relative group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Verified Delivery</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Volunteers collect the food safely, verify handoff with the donor, transport it in thermal containers,
                and distribute fresh meals directly to hungry individuals.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>Impact Logged & Audited</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PLATFORM IMPACT STATISTICS */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
              Real-World Platform Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Every Meal Rescued Creates Ripples
            </h2>
            <p className="text-slate-400 text-sm">
              Clear accountability with verified actual meals and FAO-modeled environmental savings.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center mx-auto">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                {stats.verifiedMealsDelivered || 90}+
              </div>
              <div className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                Meals Served
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Verified Delivered Figures
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-warmth-500/20 text-warmth-400 flex items-center justify-center mx-auto">
                <Leaf className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                {stats.estimatedKgFoodSaved || 36}+ kg
              </div>
              <div className="text-xs font-bold text-warmth-400 uppercase tracking-wider">
                Food Waste Saved
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Estimated Landfill Prevention
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                <Building className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                {stats.participatingDonors || 3}
              </div>
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Partner Donors
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Hotels, Caterers & Hostels
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                {stats.participatingNgos || 3}
              </div>
              <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Partner NGOs
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Orphanages & Shelters
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHO WE CONNECT (DONORS & NGOS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Donors Card */}
          <div className="bg-gradient-to-br from-brand-50 to-emerald-100/60 rounded-3xl p-8 sm:p-10 border border-brand-200 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-brand-600 text-white">
                For Surplus Donors
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Are you a Hotel, Restaurant, Hostel, or Function Hall?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Banquet events, wedding halls, and commercial kitchens frequently prepare for surplus margins.
                Instead of discarding untouched trays, list them on FoodBridge in under 60 seconds.
              </p>

              <ul className="space-y-2 text-xs font-semibold text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  <span>Zero-cost social responsibility & ESG impact reporting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  <span>Verified NGO pickup with volunteer ID and vehicle check</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  <span>Legally protected food safety declaration & release</span>
                </li>
              </ul>
            </div>

            <Link
              to="/donate"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition"
            >
              <span>List Surplus Food</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* NGOs Card */}
          <div className="bg-gradient-to-br from-warmth-50 to-amber-100/60 rounded-3xl p-8 sm:p-10 border border-warmth-200 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-warmth-600 text-slate-900">
                For NGOs & Charities
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Are you an Orphanage, Old-Age Home, or Relief NGO?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Access dependable, freshly cooked meals and raw produce from premier catering services
                and banquet venues. Feed your children, elders, and community members with dignity.
              </p>

              <ul className="space-y-2 text-xs font-semibold text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-warmth-700" />
                  <span>Real-time surplus food alerts by city and proximity</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-warmth-700" />
                  <span>Categorized by dietary type: Vegetarian, Vegan, Halal</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-warmth-700" />
                  <span>Direct phone coordination with donor venue manager</span>
                </li>
              </ul>
            </div>

            <Link
              to="/donations"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition"
            >
              <span>Browse Food Listings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Voices of Impact
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Trusted by Leaders in Hospitality & Care
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <Quote className="w-8 h-8 text-brand-300" />
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              “Our banquet operations host grand weddings. Previously, seeing 50-80 servings of untouched biryani go
              unused broke my team’s heart. FoodBridge matched us with an orphanage 3 km away in 15 minutes.”
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm">
                VA
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-900">Chef Vikram Anand</h5>
                <p className="text-[11px] text-slate-500">Executive Chef, Grand Royal Hotel</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <Quote className="w-8 h-8 text-warmth-300" />
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              “We house 75 orphaned children. Food donations through FoodBridge have provided our kids with
              nutritious, delicious festive meals that brighten their spirits every week.”
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-warmth-100 text-warmth-800 font-bold flex items-center justify-center text-sm">
                RP
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-900">Rajeshwari Patel</h5>
                <p className="text-[11px] text-slate-500">Director, Hope Child Care Home</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <Quote className="w-8 h-8 text-emerald-300" />
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              “The verification PIN and tracking timeline gives our catering team full peace of mind. We know exactly
              which driver picked up the food and when it reached the shelter.”
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                AS
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-900">Anita Sharma</h5>
                <p className="text-[11px] text-slate-500">Operations Head, The Green Leaf Caterers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-700 via-emerald-700 to-slate-900 rounded-3xl p-8 sm:p-14 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 max-w-xl">
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to turn surplus meals into hope?
            </h3>
            <p className="text-brand-100 text-sm leading-relaxed">
              Join thousands of community chefs, banquet managers, and volunteer relief organizers today.
              Takes less than 2 minutes to register.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-shrink-0">
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-lg text-center transition"
            >
              Create Free Account
            </Link>
            <Link
              to="/donations"
              className="px-6 py-3.5 rounded-2xl bg-brand-500/30 hover:bg-brand-500/40 text-white font-bold text-sm border border-brand-400/40 text-center transition"
            >
              Browse Active Rescues
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
