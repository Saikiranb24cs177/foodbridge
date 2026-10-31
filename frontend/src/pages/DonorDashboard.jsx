import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Users,
  Edit,
  XCircle,
  Eye,
  Building,
  KeyRound,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { donationService } from '../services/donationService';
import { requestService } from '../services/requestService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const DonorDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'completed' | 'all'
  const [actionInProgressId, setActionInProgressId] = useState(null);

  // Edit donation modal state
  const [editingDonation, setEditingDonation] = useState(null);
  const [editForm, setEditForm] = useState({
    foodName: '',
    quantity: '',
    servings: '',
    description: '',
  });

  const fetchMyDonations = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await donationService.getMyDonations();
      setDonations(res.donations || []);
    } catch (err) {
      console.error(err);
      showToast('Could not load your donations', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchMyDonations();
  }, [fetchMyDonations]);

  // Handle responding to an NGO request
  const handleRespondToRequest = async (requestId, action) => {
    try {
      setActionInProgressId(requestId);
      const res = await requestService.respondToRequest(
        requestId,
        action,
        action === 'accept'
          ? 'Accepted by donor kitchen. Please pick up on schedule.'
          : 'Kitchen unavailable for this schedule.'
      );
      showToast(res.message || `Request ${action}ed!`, 'success');
      await fetchMyDonations();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Action failed', 'error');
    } finally {
      setActionInProgressId(null);
    }
  };

  // Handle cancelling a donation
  const handleCancelDonation = async (donationId) => {
    const confirm = window.confirm('Are you sure you want to cancel this surplus food listing?');
    if (!confirm) return;

    try {
      setActionInProgressId(donationId);
      await donationService.cancelDonation(donationId, 'Cancelled by donor organization');
      showToast('Donation cancelled successfully', 'info');
      await fetchMyDonations();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to cancel donation', 'error');
    } finally {
      setActionInProgressId(null);
    }
  };

  // Handle opening edit modal
  const handleOpenEdit = (donation) => {
    setEditingDonation(donation);
    setEditForm({
      foodName: donation.foodName,
      quantity: donation.quantity,
      servings: donation.servings,
      description: donation.description || '',
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingDonation) return;

    try {
      setActionInProgressId(editingDonation._id || editingDonation.id);
      await donationService.updateDonation(editingDonation._id || editingDonation.id, {
        foodName: editForm.foodName,
        quantity: editForm.quantity,
        servings: Number(editForm.servings),
        description: editForm.description,
      });
      showToast('Donation details updated successfully!', 'success');
      setEditingDonation(null);
      await fetchMyDonations();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to update', 'error');
    } finally {
      setActionInProgressId(null);
    }
  };

  // Compute statistics
  const activeDonations = donations.filter((d) =>
    ['Available', 'Requested', 'Accepted', 'Picked Up'].includes(d.status)
  );
  const completedDonations = donations.filter((d) => d.status === 'Delivered');
  const totalMealsDonated = donations.reduce((sum, d) => sum + (Number(d.servings) || 0), 0);
  const pendingRequestsTotal = donations.reduce(
    (sum, d) => sum + (d.pendingRequestsCount || 0),
    0
  );

  const displayedDonations =
    activeTab === 'active'
      ? activeDonations
      : activeTab === 'completed'
      ? completedDonations
      : donations;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
            <Building className="w-3.5 h-3.5" />
            <span>Donor Hub • {user?.organizationType || 'Kitchen'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user?.organizationName || user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Manage your banquet surplus batches, approve NGO requests, and track meals delivered to the hungry.
          </p>
        </div>

        <Link
          to="/donate"
          className="px-6 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-500/30 flex items-center gap-2 transition flex-shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Post New Donation</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Batches</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-700">{activeDonations.length}</p>
          <p className="text-[11px] text-slate-500">Currently in rescue cycle</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Claims</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">{pendingRequestsTotal}</p>
          <p className="text-[11px] text-slate-500">Awaiting your approval</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Servings</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalMealsDonated}</p>
          <p className="text-[11px] text-slate-500">Estimated meals provided</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Feasts</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-teal-700">{completedDonations.length}</p>
          <p className="text-[11px] text-slate-500">Delivered to beneficiaries</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'active'
              ? 'bg-brand-50 text-brand-700 border border-brand-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Active Batches & Requests</span>
          <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[11px] flex items-center justify-center font-bold">
            {activeDonations.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'completed'
              ? 'bg-brand-50 text-brand-700 border border-brand-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Delivered / Completed</span>
          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] flex items-center justify-center font-bold">
            {completedDonations.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'all'
              ? 'bg-brand-50 text-brand-700 border border-brand-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Listings ({donations.length})
        </button>
      </div>

      {/* Donations List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : displayedDonations.length > 0 ? (
        <div className="space-y-6">
          {displayedDonations.map((donation) => {
            const hasPendingRequests =
              donation.requests && donation.requests.some((r) => r.status === 'Pending');

            return (
              <div
                key={donation._id || donation.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100"
              >
                {/* Donation Card Header */}
                <div className="p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={donation.imageUrl}
                      alt={donation.foodName}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-slate-100 flex-shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={donation.status} size="sm" />
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {donation.category}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {donation.dietaryType}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {donation.foodName}
                      </h3>

                      <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                        <span className="font-semibold text-brand-700">
                          {donation.servings} Servings ({donation.quantity})
                        </span>
                        <span>•</span>
                        <span>
                          Safe until: {new Date(donation.expiryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span>•</span>
                        <span>{donation.pickupCity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Tracking Link */}
                  <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
                    <Link
                      to={`/donations/${donation._id || donation.id}`}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Tracking & Details</span>
                    </Link>

                    {['Available', 'Requested'].includes(donation.status) && (
                      <button
                        onClick={() => handleOpenEdit(donation)}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    )}

                    {!['Delivered', 'Cancelled'].includes(donation.status) && (
                      <button
                        onClick={() => handleCancelDonation(donation._id || donation.id)}
                        disabled={actionInProgressId === (donation._id || donation.id)}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition flex items-center gap-1 disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* If status is Accepted, display Verification PIN Banner for Kitchen handoff */}
                {donation.status === 'Accepted' && donation.acceptedRequest && (
                  <div className="bg-amber-50/80 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <KeyRound className="w-5 h-5 text-amber-700 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-amber-900 text-sm">
                          Volunteer Pickup Verification PIN:{' '}
                          <span className="font-mono text-base px-2 py-0.5 rounded bg-white border border-amber-300 font-extrabold text-amber-950">
                            {donation.acceptedRequest.verificationOtp || '3924'}
                          </span>
                        </p>
                        <p className="text-amber-800">
                          Matched with {donation.assignedNgo?.organizationName || 'Assigned NGO'}. Check volunteer ID
                          and collect PIN before releasing food trays.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Incoming Requests Section */}
                {donation.requests && donation.requests.length > 0 && (
                  <div className="p-5 sm:p-6 bg-slate-50/80 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                      <span>Incoming NGO Requests ({donation.requests.length})</span>
                      {hasPendingRequests && (
                        <span className="text-amber-600 font-bold animate-pulse text-[11px]">
                          Action Required: Pending Claim
                        </span>
                      )}
                    </h4>

                    <div className="space-y-3">
                      {donation.requests.map((req) => (
                        <div
                          key={req._id || req.id}
                          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900">
                                {req.ngo?.organizationName || req.ngo?.name || 'Local NGO'}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  req.status === 'Accepted'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : req.status === 'Rejected'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {req.status}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600">
                              Claiming <strong className="text-slate-800">{req.servingsRequested} servings</strong> • Pickup:{' '}
                              <strong>{req.proposedPickupTime}</strong>
                            </p>

                            <p className="text-xs text-slate-500">
                              Volunteer: {req.volunteerName} ({req.volunteerPhone}) {req.vehicleNumber ? `• Vehicle: ${req.vehicleNumber}` : ''}
                            </p>

                            {req.message && (
                              <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-xl mt-1">
                                “{req.message}”
                              </p>
                            )}
                          </div>

                          {/* Accept / Decline buttons for pending requests */}
                          {req.status === 'Pending' && donation.status !== 'Accepted' && (
                            <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                              <button
                                onClick={() => handleRespondToRequest(req._id || req.id, 'accept')}
                                disabled={actionInProgressId === (req._id || req.id)}
                                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
                              >
                                Accept Claim
                              </button>
                              <button
                                onClick={() => handleRespondToRequest(req._id || req.id, 'reject')}
                                disabled={actionInProgressId === (req._id || req.id)}
                                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition disabled:opacity-50"
                              >
                                Decline
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No donations in this view</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Whenever your hotel, banquet, or kitchen has surplus meals, post them to rescue hungry lives.
          </p>
          <Link
            to="/donate"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post First Surplus Batch</span>
          </Link>
        </div>
      )}

      {/* Edit Donation Modal */}
      {editingDonation && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Edit Surplus Food Details</h3>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Food Name</label>
                <input
                  type="text"
                  value={editForm.foodName}
                  onChange={(e) => setEditForm({ ...editForm, foodName: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="text"
                    value={editForm.quantity}
                    onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Servings</label>
                  <input
                    type="number"
                    min="1"
                    value={editForm.servings}
                    onChange={(e) => setEditForm({ ...editForm, servings: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingDonation(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;
