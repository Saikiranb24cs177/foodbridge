import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Clock, ShieldCheck, ArrowRight, Building2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

const FoodCard = ({ donation, onRequestClick, userRole }) => {
  const expiryDate = new Date(donation.expiryTime);
  const now = new Date();
  const diffHours = Math.round((expiryDate - now) / (1000 * 60 * 60));
  const isUrgent = diffHours > 0 && diffHours <= 4;
  const isExpired = diffHours <= 0;

  const dietaryColors = {
    Vegetarian: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    'Non-Vegetarian': 'bg-rose-100 text-rose-800 border-rose-300',
    Vegan: 'bg-teal-100 text-teal-800 border-teal-300',
    Eggetarian: 'bg-amber-100 text-amber-800 border-amber-300',
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col hover:-translate-y-0.5">
      {/* Image & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={donation.imageUrl}
          alt={donation.foodName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Dietary Badge */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md ${
              dietaryColors[donation.dietaryType] || 'bg-white text-slate-800'
            }`}
          >
            {donation.dietaryType}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/95 text-slate-700 border border-slate-200 shadow-sm backdrop-blur-md">
            {donation.category}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={donation.status} size="sm" />
        </div>

        {/* Servings Pill */}
        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md">
          <Users className="w-3.5 h-3.5 text-brand-400" />
          <span>{donation.servings} Servings</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-200">{donation.quantity}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Donor info */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700 truncate">
              {donation.donor?.organizationName || donation.donor?.name || 'Verified Donor'}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 text-[11px] font-medium">
              {donation.donor?.organizationType || 'Kitchen'}
            </span>
          </div>

          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-brand-600 transition-colors">
            {donation.foodName}
          </h3>

          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {donation.description || 'Prepared fresh and maintained under safe storage guidelines.'}
          </p>
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2">
          {/* Location & Time */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 truncate max-w-[55%]">
              <MapPin className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
              <span className="truncate">{donation.pickupCity || donation.pickupAddress}</span>
            </span>

            <span
              className={`flex items-center gap-1 font-semibold ${
                isExpired
                  ? 'text-red-600'
                  : isUrgent
                  ? 'text-amber-600 animate-pulse'
                  : 'text-slate-600'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>
                {isExpired
                  ? 'Expired'
                  : isUrgent
                  ? `${diffHours}h left to save!`
                  : `Safe for ~${diffHours}h`}
              </span>
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            <Link
              to={`/donations/${donation._id || donation.id}`}
              className="flex-1 text-center py-2 px-3 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition flex items-center justify-center gap-1"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {donation.status === 'Available' && (
              <button
                onClick={() => (onRequestClick ? onRequestClick(donation) : null)}
                className="flex-1 py-2 px-3 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow transition flex items-center justify-center gap-1"
              >
                <span>Request Food</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
