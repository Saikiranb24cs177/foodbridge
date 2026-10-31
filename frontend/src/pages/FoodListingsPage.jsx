import React, { useEffect, useState, useCallback } from 'react';
import {
  Search,
  MapPin,
  Filter,
  Sparkles,
  ArrowUpDown,
  UtensilsCrossed,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import FoodCard from '../components/FoodCard';
import RequestModal from '../components/RequestModal';
import { donationService } from '../services/donationService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const CATEGORIES = [
  'All',
  'Cooked Meals',
  'Bakery & Snacks',
  'Raw Groceries',
  'Fruits & Vegetables',
  'Beverages',
];

const DIETARY_TYPES = ['All', 'Vegetarian', 'Non-Vegetarian', 'Vegan'];

const FoodListingsPage = () => {
  const { user, isNgo, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDiet, setSelectedDiet] = useState('All');
  const [sortBy, setSortBy] = useState('urgency'); // 'urgency' | 'newest' | 'servings'
  const [statusFilter, setStatusFilter] = useState('Available');

  // Request modal state
  const [selectedDonationForRequest, setSelectedDonationForRequest] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const fetchDonations = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await donationService.getAllDonations({
        search: search.trim() || undefined,
        city: city.trim() || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        dietaryType: selectedDiet !== 'All' ? selectedDiet : undefined,
        status: statusFilter,
        sortBy,
      });
      setDonations(res.donations || []);
    } catch (err) {
      console.error('Error fetching donations', err);
      showToast('Could not load donations feed', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [search, city, selectedCategory, selectedDiet, statusFilter, sortBy, showToast]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const handleOpenRequest = (donation) => {
    if (!isAuthenticated) {
      showToast('Please sign in as an NGO to request food', 'info');
      return;
    }
    if (!isNgo) {
      showToast('Only registered NGOs and shelters can claim surplus food batches', 'error');
      return;
    }
    setSelectedDonationForRequest(donation);
    setIsRequestModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCity('');
    setSelectedCategory('All');
    setSelectedDiet('All');
    setSortBy('urgency');
    setStatusFilter('Available');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
            Real-Time Food Rescue Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Available Surplus Food
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Fresh, verified surplus batches ready for prompt NGO collection and distribution.
          </p>
        </div>

        {/* Quick status switch */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="p-1 bg-slate-100 rounded-xl flex items-center gap-1 text-xs font-bold text-slate-600">
            <button
              onClick={() => setStatusFilter('Available')}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === 'Available'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'hover:text-slate-900'
              }`}
            >
              Available Only
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === 'all'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'hover:text-slate-900'
              }`}
            >
              All Recent Listings
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        {/* Top search & city row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by food name, dish, or donor venue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            />
          </div>

          <div className="sm:col-span-3 relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Filter by city (e.g. Bengaluru)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            />
          </div>

          <div className="sm:col-span-3 relative">
            <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium bg-white"
            >
              <option value="urgency">Expiry Urgency (Urgent First)</option>
              <option value="newest">Newest Listed First</option>
              <option value="servings">Largest Servings First</option>
            </select>
          </div>
        </div>

        {/* Category & Dietary Chips */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Category:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 mr-1">Diet:</span>
            {DIETARY_TYPES.map((diet) => (
              <button
                key={diet}
                onClick={() => setSelectedDiet(diet)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  selectedDiet === diet
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {diet}
              </button>
            ))}

            {(search || city || selectedCategory !== 'All' || selectedDiet !== 'All' || sortBy !== 'urgency') && (
              <button
                onClick={handleResetFilters}
                className="ml-2 text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-900">{donations.length}</strong> surplus food donation batches
        </span>
        {statusFilter === 'Available' && (
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Real-time Available
          </span>
        )}
      </div>

      {/* Grid of Food Listings */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-sm animate-pulse"
            >
              <div className="h-44 bg-slate-200 rounded-xl" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
              <div className="h-8 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : donations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((donation) => (
            <FoodCard
              key={donation._id || donation.id}
              donation={donation}
              onRequestClick={handleOpenRequest}
              userRole={user?.role}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No surplus donations match your filter</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Try adjusting your category, city search, or resetting your filters to see all available batches.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Request Modal for NGOs */}
      <RequestModal
        donation={selectedDonationForRequest}
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={() => {
          fetchDonations();
        }}
      />
    </div>
  );
};

export default FoodListingsPage;
