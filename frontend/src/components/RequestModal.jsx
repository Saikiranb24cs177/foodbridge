import React, { useState } from 'react';
import { X, Users, Clock, Phone, User, Truck, MessageSquare, AlertCircle } from 'lucide-react';
import { requestService } from '../services/requestService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const RequestModal = ({ donation, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [servingsRequested, setServingsRequested] = useState(donation?.servings || 50);
  const [proposedPickupTime, setProposedPickupTime] = useState('Today within 2 hours');
  const [volunteerName, setVolunteerName] = useState(user?.name || '');
  const [volunteerPhone, setVolunteerPhone] = useState(user?.phone || '');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !donation) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!servingsRequested || Number(servingsRequested) <= 0) {
      setError('Please specify valid servings requested');
      return;
    }

    if (Number(servingsRequested) > donation.servings) {
      setError(`Cannot request more than the available ${donation.servings} servings`);
      return;
    }

    if (!proposedPickupTime || !volunteerName || !volunteerPhone) {
      setError('Please provide pickup time and volunteer contact details');
      return;
    }

    try {
      setIsSubmitting(true);
      await requestService.createRequest({
        donationId: donation._id || donation.id,
        servingsRequested: Number(servingsRequested),
        proposedPickupTime,
        volunteerName,
        volunteerPhone,
        vehicleNumber,
        message,
      });

      showToast('Request submitted to donor! You will be notified when accepted.', 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 block mb-1">
            NGO Food Rescue Claim
          </span>
          <h2 className="text-xl font-bold">{donation.foodName}</h2>
          <p className="text-xs text-slate-300 mt-1">
            Listed by {donation.donor?.organizationName || donation.donor?.name} •{' '}
            <span className="text-brand-300 font-semibold">{donation.servings} servings available</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Servings Needed *
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  min="1"
                  max={donation.servings}
                  value={servingsRequested}
                  onChange={(e) => setServingsRequested(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  required
                />
              </div>
              <span className="text-[11px] text-slate-400">Max: {donation.servings} servings</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Proposed Pickup Time *
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Today 5:00 PM"
                  value={proposedPickupTime}
                  onChange={(e) => setProposedPickupTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Volunteer / Driver Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Person picking up"
                  value={volunteerName}
                  onChange={(e) => setVolunteerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Volunteer Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={volunteerPhone}
                  onChange={(e) => setVolunteerPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Vehicle Registration Number (Optional)
            </label>
            <div className="relative">
              <Truck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="e.g. KA-01-AB-1234 or Van / Bike"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Beneficiary Distribution Note / Message
            </label>
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <textarea
                rows="2"
                placeholder="Describe where this food will be distributed (e.g. 50 children at shelter)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md hover:shadow-lg transition disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting Claim...' : 'Confirm Request & Notify Donor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestModal;
