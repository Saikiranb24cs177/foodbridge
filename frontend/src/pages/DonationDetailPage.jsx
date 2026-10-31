import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  MapPin,
  Clock,
  Building,
  Phone,
  ShieldCheck,
  AlertTriangle,
  Users,
  Calendar,
  Truck,
  HeartHandshake,
  CheckCircle2,
  Flag,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import TrackingTimeline from '../components/TrackingTimeline';
import RequestModal from '../components/RequestModal';
import { donationService } from '../services/donationService';
import { requestService } from '../services/requestService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const DonationDetailPage = () => {
  const { id } = useParams();
  const { user, isNgo, isDonor, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [donation, setDonation] = useState(null);
  const [trackingLogs, setTrackingLogs] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Request modal
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  // Report modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);

  const fetchDonation = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await donationService.getDonationById(id);
      setDonation(res.donation);
      setTrackingLogs(res.trackingLogs || []);
      setRequests(res.requests || []);
    } catch (err) {
      console.error(err);
      showToast('Could not load food donation listing', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    fetchDonation();
  }, [fetchDonation]);

  const handleReport = async (e) => {
    e.preventDefault();
    if (!reportReason.trim()) return;

    try {
      setIsReporting(true);
      await donationService.reportDonation(id, reportReason);
      showToast('Report submitted for admin review. Thank you for safeguarding food safety!', 'info');
      setIsReportModalOpen(false);
      setReportReason('');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Report failed', 'error');
    } finally {
      setIsReporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading donation details & tracking timeline...</p>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Donation Listing Not Found</h2>
        <p className="text-xs text-slate-500">This donation listing might have been removed or expired.</p>
        <Link
          to="/donations"
          className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
        >
          Back to Listings
        </Link>
      </div>
    );
  }

  const donor = donation.donor || {};
  const isOwner = user && donor && (user._id === donor._id || user.id === donor._id || user.id === donor.id);
  const expiryDate = new Date(donation.expiryTime);
  const now = new Date();
  const diffHours = Math.round((expiryDate - now) / (1000 * 60 * 60));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link
        to="/donations"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Surplus Food Listings</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Food Details & Donor Card */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Food Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Image */}
            <div className="relative h-72 sm:h-96 w-full bg-slate-100">
              <img
                src={donation.imageUrl}
                alt={donation.foodName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/95 text-slate-900 shadow-md backdrop-blur-md">
                  {donation.dietaryType}
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900/80 text-white shadow-md backdrop-blur-md">
                  {donation.category}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <StatusBadge status={donation.status} size="lg" />
              </div>
            </div>

            {/* Details Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {donation.foodName}
                </h1>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {donation.description || 'Prepared fresh and maintained under sanitary food storage conditions.'}
                </p>
              </div>

              {/* Servings & Quantity Highlight Box */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[10px]">Total Servings</span>
                  <span className="text-lg font-extrabold text-brand-700 flex items-center gap-1.5 mt-0.5">
                    <Users className="w-4 h-4" />
                    {donation.servings} Servings
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[10px]">Batch Quantity</span>
                  <span className="text-lg font-extrabold text-slate-800 mt-0.5 block truncate">
                    {donation.quantity}
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <span className="text-slate-400 font-bold uppercase block text-[10px]">Storage</span>
                  <span className="text-xs font-extrabold text-slate-700 mt-1 block">
                    {donation.storageInstruction || 'Room Temperature'}
                  </span>
                </div>
              </div>

              {/* Timing Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <span className="text-slate-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-600" />
                    Preparation Time:
                  </span>
                  <p className="font-bold text-slate-800">
                    {new Date(donation.cookedTime).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <span className="text-slate-400 font-semibold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    Safe Consumption Deadline:
                  </span>
                  <p className="font-bold text-amber-900">
                    {new Date(donation.expiryTime).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    ({diffHours > 0 ? `${diffHours}h left` : 'Expired'})
                  </p>
                </div>
              </div>

              {/* Safety Certification Badge */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-900">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Verified Food Safety Declaration</p>
                  <p className="text-emerald-800 mt-0.5">
                    Donor has formally certified that this surplus batch was prepared hygienically and stored in
                    compliance with food temperature standards.
                  </p>
                </div>
              </div>

              {/* Report button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="text-xs text-slate-400 hover:text-red-600 flex items-center gap-1 font-semibold transition"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Report questionable listing</span>
                </button>
              </div>
            </div>
          </div>

          {/* Donor Information Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-brand-600" />
              <span>Donor Venue & Contact Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-semibold">Venue / Kitchen:</span>
                <p className="font-bold text-slate-900 text-sm">
                  {donor.organizationName || donor.name}
                </p>
                <p className="text-slate-500 font-medium">Type: {donor.organizationType || 'Kitchen'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold">Contact Phone:</span>
                <p className="font-bold text-slate-900 flex items-center gap-1 text-sm">
                  <Phone className="w-3.5 h-3.5 text-brand-600" />
                  <span>{donation.contactPhone || donor.phone}</span>
                </p>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <span className="text-slate-400 font-semibold">Pickup Address:</span>
                <p className="font-semibold text-slate-800 flex items-start gap-1">
                  <MapPin className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                  <span>{donation.pickupAddress}, {donation.pickupCity}</span>
                </p>
                <p className="text-[11px] text-slate-500 pl-5">
                  Available Window: {donation.pickupWindow?.from || '10:00'} to {donation.pickupWindow?.to || '20:00'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tracking Timeline & Action Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Action Callout if Available */}
          {donation.status === 'Available' && (
            <div className="bg-gradient-to-br from-brand-600 to-emerald-700 rounded-3xl p-6 text-white shadow-xl space-y-4">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
                Ready for Rescue
              </span>
              <h3 className="text-xl font-bold leading-snug">
                Claim this {donation.servings}-serving batch for your shelter
              </h3>
              <p className="text-xs text-brand-100 leading-relaxed">
                Connect your volunteers with the donor loading kitchen. Verification PIN will be issued immediately upon donor acceptance.
              </p>
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-brand-900 font-bold text-sm shadow-md transition"
              >
                Submit NGO Rescue Request
              </button>
            </div>
          )}

          {/* If Owner / Donor */}
          {isOwner && (
            <div className="bg-slate-900 text-white p-5 rounded-3xl space-y-3">
              <h4 className="font-bold text-sm text-brand-400">Donor Management Notice</h4>
              <p className="text-xs text-slate-300">
                You are viewing your own surplus food listing. Manage incoming NGO requests from your Donor Dashboard.
              </p>
              <Link
                to="/donor/dashboard"
                className="inline-block px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition"
              >
                Go to Donor Dashboard
              </Link>
            </div>
          )}

          {/* Interactive Tracking Timeline Component */}
          <TrackingTimeline
            currentStatus={donation.status}
            trackingLogs={trackingLogs}
            verificationOtp={donation.acceptedRequest?.verificationOtp}
          />
        </div>
      </div>

      {/* Request Modal for NGOs */}
      <RequestModal
        donation={donation}
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={() => {
          fetchDonation();
        }}
      />

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Flag className="w-5 h-5 text-red-600" />
              <span>Report Food Listing</span>
            </h3>
            <p className="text-xs text-slate-500">
              Please state why you believe this listing violates food safety, hygiene, or platform integrity standards.
            </p>

            <form onSubmit={handleReport} className="space-y-4">
              <textarea
                rows="3"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="e.g. Food description mentions expired dairy products or inaccurate storage..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isReporting}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-sm disabled:opacity-50"
                >
                  {isReporting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationDetailPage;
