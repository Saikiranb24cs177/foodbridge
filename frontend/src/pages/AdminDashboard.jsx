import React, { useEffect, useState, useCallback } from 'react';
import {
  ShieldAlert,
  Users,
  Building2,
  UtensilsCrossed,
  Leaf,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Check,
  Ban,
  Trash2,
  Sparkles,
  BarChart3,
  Flame,
  ExternalLink,
} from 'lucide-react';
import { adminService, statsService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'reports'
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Users filter
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [actionInProgressId, setActionInProgressId] = useState(null);

  const fetchAdminData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [statsRes, usersRes, reportsRes] = await Promise.all([
        statsService.getPlatformStats(),
        adminService.getUsers({
          role: userRoleFilter !== 'all' ? userRoleFilter : undefined,
          search: userSearch.trim() || undefined,
        }),
        adminService.getReportedDonations(),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.users || []);
      setReports(reportsRes.donations || []);
    } catch (err) {
      console.error(err);
      showToast('Could not load administrative data', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [userRoleFilter, userSearch, showToast]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  // Toggle user suspension / activation
  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      setActionInProgressId(userId);
      await adminService.updateUserStatus(userId, { status: newStatus });
      showToast(`User marked as ${newStatus}`, 'info');
      await fetchAdminData();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Action failed', 'error');
    } finally {
      setActionInProgressId(null);
    }
  };

  // Toggle user verification
  const handleToggleVerification = async (userId, currentVerified) => {
    try {
      setActionInProgressId(userId);
      await adminService.updateUserStatus(userId, { isVerified: !currentVerified });
      showToast(`Verification status updated!`, 'success');
      await fetchAdminData();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Action failed', 'error');
    } finally {
      setActionInProgressId(null);
    }
  };

  // Resolve safety report
  const handleResolveReport = async (donationId) => {
    try {
      setActionInProgressId(donationId);
      await adminService.resolveReport(donationId);
      showToast('Safety report resolved and dismissed', 'success');
      await fetchAdminData();
    } catch (err) {
      showToast('Failed to resolve report', 'error');
    } finally {
      setActionInProgressId(null);
    }
  };

  // Delete / Take down donation listing
  const handleDeleteDonation = async (donationId) => {
    const confirm = window.confirm('Remove this food listing permanently?');
    if (!confirm) return;

    try {
      setActionInProgressId(donationId);
      await adminService.deleteDonation(donationId);
      showToast('Listing removed by administrator', 'info');
      await fetchAdminData();
    } catch (err) {
      showToast('Failed to remove donation', 'error');
    } finally {
      setActionInProgressId(null);
    }
  };

  const verified = stats?.verified || {};
  const estimates = stats?.estimates || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Platform Governance Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            FoodBridge Headquarters
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Manage participating organizations, monitor impact transparency, and ensure strict food safety compliance.
          </p>
        </div>

        {reports.length > 0 && (
          <div className="px-4 py-2 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>{reports.length} Flagged Listing(s) Need Review</span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-amber-50 text-amber-900 border border-amber-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Impact Overview & Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-amber-50 text-amber-900 border border-amber-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User & Organization Management</span>
          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[11px] flex items-center justify-center font-bold">
            {users.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'bg-red-50 text-red-900 border border-red-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span>Reported Listings</span>
          {reports.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[11px] flex items-center justify-center font-bold">
              {reports.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: IMPACT OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* SECTION A: VERIFIED ACTUAL FIGURES */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider">
                Actual Verified Figures
              </span>
              <span className="text-xs text-slate-400">
                (Backed by confirmed delivery timestamps and digital OTP handoffs)
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Donations Listed
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {verified.totalDonations || 0}
                </p>
                <p className="text-[11px] text-emerald-700 font-semibold">
                  Actual Verified Batches
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Verified Meals Delivered
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-brand-600">
                  {verified.verifiedMealsDelivered || 0}
                </p>
                <p className="text-[11px] text-emerald-700 font-semibold">
                  Actual Meals Distributed
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Participating Donors
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-blue-600">
                  {verified.participatingDonors || 0}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Verified Hotels & Caterers
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Participating NGOs
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-purple-600">
                  {verified.participatingNgos || 0}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Verified Shelters & Trusts
                </p>
              </div>
            </div>
          </div>

          {/* SECTION B: ESTIMATED IMPACT FIGURES */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-extrabold uppercase tracking-wider">
                Estimated Impact Projections
              </span>
              <span className="text-xs text-slate-400">
                (Model calculations based on FAO 0.4kg/meal and EPA 1.9kg CO2e benchmarks)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 p-6 rounded-3xl border border-amber-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Estimated Meals Offered
                </span>
                <p className="text-3xl font-extrabold text-amber-950">
                  {estimates.estimatedMealsOffered || 0}
                </p>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Sum of all servings listed across active, accepted, and completed batches.
                </p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50/70 p-6 rounded-3xl border border-emerald-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Estimated Food Waste Saved
                </span>
                <p className="text-3xl font-extrabold text-emerald-950">
                  {estimates.estimatedKgFoodSaved || 0} kg
                </p>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Estimated weight diverted from city landfills to human nourishment.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/70 p-6 rounded-3xl border border-blue-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                  Estimated CO2 Saved
                </span>
                <p className="text-3xl font-extrabold text-blue-950">
                  {estimates.estimatedCo2SavedKg || 0} kg CO2e
                </p>
                <p className="text-xs text-blue-900 leading-relaxed">
                  Avoided greenhouse gas emissions from organic decomposition in landfills.
                </p>
              </div>
            </div>
          </div>

          {/* Category Breakdown Table */}
          {stats?.categoryBreakdown && stats.categoryBreakdown.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-brand-600" />
                <span>Food Categories Breakdown</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.categoryBreakdown.map((cat) => (
                  <div
                    key={cat.category}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900">{cat.category}</p>
                      <p className="text-xs text-slate-500">{cat.donationsCount} batches listed</p>
                    </div>
                    <span className="text-sm font-extrabold text-brand-700 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                      {cat.totalServings} Servings
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: USER & ORGANIZATION MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* User Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search user name, email, organization, or city..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400">Role:</span>
              {['all', 'donor', 'ngo', 'admin'].map((r) => (
                <button
                  key={r}
                  onClick={() => setUserRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                    userRoleFilter === r
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4 pl-6">User / Contact</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Organization & Type</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Verification</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {users.map((u) => (
                    <tr key={u._id || u.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-4 pl-6">
                        <p className="font-bold text-slate-900 text-sm">{u.name}</p>
                        <p className="text-slate-500">{u.email}</p>
                        <p className="text-slate-400 font-mono text-[11px]">{u.phone}</p>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                            u.role === 'donor'
                              ? 'bg-emerald-100 text-emerald-800'
                              : u.role === 'ngo'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-slate-800">{u.organizationName || 'N/A'}</p>
                        <p className="text-slate-500 text-[11px]">{u.organizationType || 'Individual'}</p>
                      </td>

                      <td className="p-4">
                        <p className="font-medium text-slate-800">{u.city}</p>
                        <p className="text-slate-400 text-[11px] truncate max-w-[150px]">{u.address}</p>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleToggleVerification(u._id || u.id, u.isVerified)}
                          disabled={actionInProgressId === (u._id || u.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
                            u.isVerified
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                          }`}
                          title="Click to toggle verified status"
                        >
                          <Check className="w-3 h-3" />
                          <span>{u.isVerified ? 'Verified' : 'Pending'}</span>
                        </button>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            u.status === 'active'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>

                      <td className="p-4 pr-6 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleUserStatus(u._id || u.id, u.status)}
                            disabled={actionInProgressId === (u._id || u.id)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition disabled:opacity-50 ${
                              u.status === 'active'
                                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {u.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REPORTED LISTINGS */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((d) => (
                <div
                  key={d._id || d.id}
                  className="bg-white rounded-3xl border border-red-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-bold text-xs flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Flagged ({d.reportsCount || 1} report)</span>
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">{d.category}</span>
                    </div>

                    <h4 className="text-lg font-bold text-slate-900">{d.foodName}</h4>

                    <p className="text-xs text-slate-600">
                      Donor: <strong className="text-slate-800">{d.donor?.organizationName || d.donor?.name}</strong> • Phone:{' '}
                      {d.contactPhone || d.donor?.phone}
                    </p>

                    <div className="bg-red-50 p-3 rounded-2xl border border-red-100 text-xs text-red-900">
                      <strong>Report Reason:</strong> {d.reportReason || 'User flagged this listing for food safety review.'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center flex-shrink-0">
                    <button
                      onClick={() => handleResolveReport(d._id || d.id)}
                      disabled={actionInProgressId === (d._id || d.id)}
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
                    >
                      Dismiss Report (Approve)
                    </button>

                    <button
                      onClick={() => handleDeleteDonation(d._id || d.id)}
                      disabled={actionInProgressId === (d._id || d.id)}
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white transition shadow-sm flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Take Down Listing</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No reported listings</h3>
              <p className="text-xs text-slate-500">
                All food listings comply with platform standards. Zero pending safety violations!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
