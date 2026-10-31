import React from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  HeartHandshake,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  HelpCircle,
  AlertTriangle,
  Building,
  Users,
} from 'lucide-react';

const FAQS = [
  {
    q: 'What types of food can hotels and restaurants donate?',
    a: 'Hotels, catering services, and restaurants can donate untouched banquet food, fresh bakery items, prepared meals kept above 65°C in warmers or below 5°C in chillers, raw groceries, and fresh produce. Partially eaten or unhygienically handled food is strictly forbidden.',
  },
  {
    q: 'How does FoodBridge verify NGOs and shelters?',
    a: 'Every participating NGO, orphanage, or old-age home undergoes platform verification. Our admin team validates their registered charitable trust deed, operational physical address, and designated volunteer contacts before authorizing them to claim food.',
  },
  {
    q: 'How is pickup verified between the donor venue and the NGO driver?',
    a: 'When a donor accepts an NGO’s request, FoodBridge generates a unique 4-digit verification PIN. The volunteer driver presents this PIN and their vehicle ID to the loading kitchen staff before taking custody of the food.',
  },
  {
    q: 'Is there any charge or subscription fee to use FoodBridge?',
    a: 'FoodBridge is 100% free of charge for both donors and NGOs. Our mission is strictly social impact: zero food waste, zero hunger.',
  },
  {
    q: 'What happens if food expires before an NGO claims it?',
    a: 'Donation listings automatically close once their safe consumption deadline passes. Donors are also encouraged to cancel or update listings if their kitchen schedule changes.',
  },
];

const HowItWorksPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3.5 py-1 rounded-full">
          The FoodBridge Workflow
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          How FoodBridge Works
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          From hotel banquet kitchens to orphanage dining tables: a safe, verified, 3-step food rescue journey.
        </p>
      </div>

      {/* 3 Step Breakdown */}
      <div className="space-y-8">
        {/* Step 1 */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-brand-50 rounded-2xl border border-brand-100 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-brand-600/30 mb-3">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900">Step 1: Listing Surplus</h3>
            <span className="text-xs text-brand-700 font-semibold mt-1">Takes ~60 Seconds</span>
          </div>

          <div className="md:col-span-8 space-y-3">
            <h4 className="text-xl font-bold text-slate-900">
              Donor Venue Publishes Food Details & Safety Certification
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              When a banquet, wedding, conference, or restaurant has untouched trays of fresh meals, the chef or
              catering manager lists the dish name, estimated servings, safe consumption deadline (expiry), and
              available loading dock pickup window.
            </p>
            <div className="flex flex-wrap gap-2 pt-2 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                Mandatory Food Safety Certification
              </span>
              <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                Hot / Cold Storage Guidance
              </span>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-warmth-50 rounded-2xl border border-warmth-100 text-center">
            <div className="w-16 h-16 rounded-2xl bg-warmth-500 text-slate-900 flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-warmth-500/30 mb-3">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900">Step 2: NGO Claim & Match</h3>
            <span className="text-xs text-warmth-800 font-semibold mt-1">Instant Notification</span>
          </div>

          <div className="md:col-span-8 space-y-3">
            <h4 className="text-xl font-bold text-slate-900">
              Local Shelter Claims Food & Donor Approves
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Verified NGOs and shelters in the vicinity receive an immediate alert. The NGO coordinator submits a claim
              specifying volunteer driver contact and vehicle info. Once the donor kitchen clicks "Accept", a unique
              4-digit verification PIN is issued to the volunteer.
            </p>
            <div className="flex flex-wrap gap-2 pt-2 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-warmth-600" />
                4-Digit Security Handoff PIN
              </span>
              <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-warmth-600" />
                Volunteer ID Verification
              </span>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-emerald-600/30 mb-3">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900">Step 3: Safe Delivery</h3>
            <span className="text-xs text-emerald-800 font-semibold mt-1">Impact Verified</span>
          </div>

          <div className="md:col-span-8 space-y-3">
            <h4 className="text-xl font-bold text-slate-900">
              Volunteers Transport Food & Feed Beneficiaries
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Volunteers collect the food in thermal containers, verify handoff with the donor, and update the status to
              "Picked Up". Upon reaching the shelter, the meals are immediately served, and the NGO confirms "Delivered",
              updating our audited meal counters.
            </p>
            <div className="flex flex-wrap gap-2 pt-2 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Real-Time Audited Activity Log
              </span>
              <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Immediate Beneficiary Relief
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Protocol Section */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-6">
        <div className="space-y-2 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
            Safety First Culture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Strict Food Safety Standards
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Protecting the health and dignity of food recipients is our highest legal and ethical mandate.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-2">
            <h5 className="font-bold text-sm text-brand-400">1. Temperature Control</h5>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hot meals must be kept above 65°C until pickup. Perishables and dairy must remain refrigerated below 5°C.
            </p>
          </div>

          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-2">
            <h5 className="font-bold text-sm text-warmth-400">2. Packaging Hygiene</h5>
            <p className="text-xs text-slate-300 leading-relaxed">
              Food must be packaged in clean, food-grade containers or sealed chafing dishes to prevent cross-contamination.
            </p>
          </div>

          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-2">
            <h5 className="font-bold text-sm text-emerald-400">3. Rapid Transit</h5>
            <p className="text-xs text-slate-300 leading-relaxed">
              NGOs must collect and distribute surplus meals within the specified safety window. Expired batches are cancelled.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Answers & Clarity
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-600 pl-6 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-8 space-y-4">
        <h3 className="text-2xl font-extrabold text-slate-900">
          Be Part of the Solution
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/donate"
            className="px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition"
          >
            Donate Surplus Food
          </Link>
          <Link
            to="/register"
            className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition"
          >
            Register Your Organization
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
