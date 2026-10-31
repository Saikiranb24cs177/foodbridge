import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartHandshake,
  Search,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Users,
  Building2,
  KeyRound,
  ShieldCheck,
  ChevronRight,
  Phone,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import RequestModal from '../components/RequestModal';
import { donationService } from '../services/donationService';
import { requestService } from '../services/requestService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const NgoDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('available'); // 'available' | 'my-claims'
  const [availableDonations, setAvailableDonations] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & filter for available food
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [city, setCity] = useState('');

  // Modal state
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionInProgressId, setActionInProgressId] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [availRes, myReqRes] = await Promise.all([
        donationService.getAllDonations({
          status: 'Available',
          search: search.trim() || undefined,
          category: category !== 'All' ? category : undefined,
          city: city.trim() || undefined,
        }),
        requestService.getMyRequests(),
      ]);

      setAvailableDonations(availRes.donations || []);
      setMyRequests(myReqRes.requests || []);
    } catch (err) {
      console.error(err);
      showToast('Could not load NGO portal data', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [search, category, city, showToast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Lifecycle transitions: Picked Up or Delivered
  const handleLifecycleUpdate = async (requestId, nextStatus) => {
    try {
      setActionInProgressId(requestId);
      const res = await requestService.updateLifecycleStatus(
        requestId,
        nextStatus,
        nextStatus === 'Picked Up'
          ? 'Volunteer collected surplus food from venue. In transit to shelter.'
          : 'Meals safely distributed to shelter residents and community members.'
      );
      showToast(res.message || `Status updated to ${nextStatus}!`, 'success');
      await fetchDashboardData();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Status update failed', 'error');
    } finally {
      setActionInProgressId(null);
    }
  };

  const handleOpenRequest = (donation) => {
    setSelectedDonation(donation);
    setIsModalOpen(true);
  };

  // Metrics
  const pendingRequests = myRequests.filter((r) => r.status === 'Pending');
  const acceptedRequests = myRequests.filter((r) => r.status === 'Accepted');
  const pickedUpRequests = myRequests.filter((r) => r.status === 'Picked Up');
  const deliveredRequests = myRequests.filter((r) => r.status === 'Delivered');

  const totalMealsRescued = myRequests
    .filter((r) => ['Accepted', 'Picked Up', 'Delivered'].includes(r.status))
    .reduce((sum, r) => sum + (Number(r.servingsRequested) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-warmth-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warmth-500/20 text-warmth-300 text-xs font-bold border border-warmth-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Relief Partner • {user?.organizationType || 'Charity'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user?.organizationName || user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Browse real-time available hotel & banquet meals, submit claims, and manage volunteer collection runs.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('available')}
          className="px-6 py-3.5 rounded-2xl bg-warmth-500 hover:bg-warmth-600 text-slate-900 font-bold text-sm shadow-lg shadow-warmth-500/20 flex items-center gap-2 transition flex-shrink-0"
        >
          <Search className="w-4 h-4" />
          <span>Find Available Food</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Batches</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-600">{availableDonations.length}</p>
          <p className="text-[11px] text-slate-500">Ready for claim right now</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ready for Pickup</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">{acceptedRequests.length}</p>
          <p className="text-[11px] text-slate-500">Accepted by donor kitchen</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">In Transit</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-600">{pickedUpRequests.length}</p>
          <p className="text-[11px] text-slate-500">Volunteers en route</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Meals Rescued</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-teal-700">{totalMealsRescued}</p>
          <p className="text-[11px] text-slate-500">Fed to hungry community</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('available')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'available'
              ? 'bg-brand-50 text-brand-700 border border-brand-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Available Food Feed</span>
          <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[11px] flex items-center justify-center font-bold">
            {availableDonations.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('my-claims')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'my-claims'
              ? 'bg-warmth-50 text-warmth-900 border border-warmth-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>My Rescue Claims & Pickups</span>
          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[11px] flex items-center justify-center font-bold">
            {myRequests.length}
          </span>
        </button>
      </div>

      {/* TAB 1: AVAILABLE FOOD FEED */}
      {activeTab === 'available' && (
        <div className="space-y-6">
          {/* Quick Filter Box */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search food, dish, or donor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="relative w-48">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="City (e.g. Bengaluru)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="All">All Categories</option>
              <option value="Cooked Meals">Cooked Meals</option>
              <option value="Bakery & Snacks">Bakery & Snacks</option>
              <option value="Raw Groceries">Raw Groceries</option>
              <option value="Fruits & Vegetables">Fruits & Vegetables</option>
            </select>
          </div>

          {/* Available Cards List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse" />
              ))}
            </div>
          ) : availableDonations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableDonations.map((donation) => {
                const diffHours = Math.round(
                  (new Date(donation.expiryTime) - new Date()) / (1000 * 60 * 60)
                );

                return (
                  <div
                    key={donation._id || donation.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={donation.imageUrl}
                        alt={donation.foodName}
                        className="w-24 h-24 rounded-2xl object-cover bg-slate-100 flex-shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {donation.dietaryType}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            {donation.category}
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-900 text-base leading-snug">
                          {donation.foodName}
                        </h3>

                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{donation.donor?.organizationName || 'Hotel Donor'}</span>
                        </p>

                        <div className="text-xs text-slate-600 flex items-center gap-3 pt-1">
                          <span className="font-bold text-brand-700">
                            {donation.servings} Servings ({donation.quantity})
                          </span>
                          <span>•</span>
                          <span className="text-amber-700 font-semibold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {diffHours > 0 ? `${diffHours}h left` : 'Urgent'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                      <span className="text-slate-500 flex items-center gap-1 truncate max-w-[50%]">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{donation.pickupCity || donation.pickupAddress}</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/donations/${donation._id || donation.id}`}
                          className="px-3 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold transition"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => handleOpenRequest(donation)}
                          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-sm transition"
                        >
                          Claim Food
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No surplus batches currently available</h3>
              <p className="text-xs text-slate-500">
                Check back shortly! Hotels and banquets frequently post surplus food after event lunches and dinners.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY RESCUE CLAIMS & PICKUPS */}
      {activeTab === 'my-claims' && (
        <div className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse" />
              ))}
            </div>
          ) : myRequests.length > 0 ? (
            <div className="space-y-4">
              {myRequests.map((request) => {
                const don = request.donation || {};
                const donor = don.donor || request.donor || {};
                const isAccepted = request.status === 'Accepted';
                const isPickedUp = request.status === 'Picked Up';
                const isDelivered = request.status === 'Delivered';

                return (
                  <div
                    key={request._id || request.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100"
                  >
                    {/* Header */}
                    <div className="p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={request.status} size="sm" />
                          <span className="text-xs font-bold text-slate-500">
                            Requested on {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900">
                          {don.foodName || 'Surplus Food Batch'}
                        </h3>

                        <p className="text-xs text-slate-600">
                          Claimed <strong className="text-slate-800">{request.servingsRequested} servings</strong> from{' '}
                          <strong className="text-slate-800">{donor.organizationName || donor.name || 'Donor'}</strong>
                        </p>
                      </div>

                      {/* Action buttons based on lifecycle */}
                      <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
                        <Link
                          to={`/donations/${don._id || don.id}`}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1"
                        >
                          <span>View Full Tracker</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        {/* If Accepted, NGO volunteer can mark Picked Up */}
                        {isAccepted && (
                          <button
                            onClick={() => handleLifecycleUpdate(request._id || request.id, 'Picked Up')}
                            disabled={actionInProgressId === (request._id || request.id)}
                            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <Truck className="w-4 h-4" />
                            <span>Mark Picked Up (In Transit)</span>
                          </button>
                        )}

                        {/* If Picked Up, NGO can mark Delivered */}
                        {isPickedUp && (
                          <button
                            onClick={() => handleLifecycleUpdate(request._id || request.id, 'Delivered')}
                            disabled={actionInProgressId === (request._id || request.id)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Confirm Meals Delivered</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Collection Details for Accepted/In-Transit status */}
                    {(isAccepted || isPickedUp) && (
                      <div className="p-5 bg-amber-50/70 border-t border-amber-200/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        {/* PIN */}
                        <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-xs">
                          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-0.5">
                            Handoff Verification PIN
                          </span>
                          <span className="font-mono text-xl font-extrabold text-amber-950 tracking-widest">
                            {request.verificationOtp || '3924'}
                          </span>
                          <span className="text-[11px] text-amber-800 block mt-0.5">
                            Show this PIN to donor kitchen staff at loading gate
                          </span>
                        </div>

                        {/* Donor Address & Contact */}
                        <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-xs space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Pickup Address & Venue
                          </span>
                          <p className="font-bold text-slate-900 leading-snug">
                            {don.pickupAddress || donor.address}
                          </p>
                          <p className="text-slate-600 flex items-center gap-1 pt-1">
                            <Phone className="w-3.5 h-3.5 text-brand-600" />
                            <span>{don.contactPhone || donor.phone}</span>
                          </p>
                        </div>

                        {/* Assigned Volunteer */}
                        <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-xs space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Assigned Volunteer / Driver
                          </span>
                          <p className="font-bold text-slate-900">
                            {request.volunteerName}
                          </p>
                          <p className="text-slate-600">
                            Phone: {request.volunteerPhone}
                          </p>
                          {request.vehicleNumber && (
                            <p className="text-slate-500 font-mono text-[11px]">
                              Vehicle: {request.vehicleNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* If Delivered banner */}
                    {isDelivered && (
                      <div className="p-4 bg-teal-50 text-teal-900 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                        <span>
                          <strong>Meals successfully delivered!</strong> All {request.servingsRequested} servings reached the beneficiaries.
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-warmth-50 text-warmth-600 flex items-center justify-center mx-auto">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No claims submitted yet</h3>
              <p className="text-xs text-slate-500">
                Browse the Available Food Feed and submit a claim for surplus meals to feed your shelter.
              </p>
              <button
                onClick={() => setActiveTab('available')}
                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                Browse Food Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* Request Modal */}
      <RequestModal
        donation={selectedDonation}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setActiveTab('my-claims');
          fetchDashboardData();
        }}
      />
    </div>
  );
};

export default NgoDashboard;
