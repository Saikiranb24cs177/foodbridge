import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  Upload,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  Image as ImageIcon,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { donationService } from '../services/donationService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Quick realistic photo presets for ease of testing
const PHOTO_PRESETS = [
  {
    label: 'Veg Biryani & Curry',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Artisanal Bakery & Buns',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Traditional Meal Feast',
    url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Pasta & Bread Trays',
    url: 'https://images.unsplash.com/photo-1621996346565-e3d5d62810b4?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Fresh Produce & Fruit',
    url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Healthy Green Bowls',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  },
];

const DonateFoodPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Helper defaults: cooked 1 hour ago, safe for next 8 hours
  const now = new Date();
  const defaultCooked = new Date(now.getTime() - 60 * 60 * 1000).toISOString().slice(0, 16);
  const defaultExpiry = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 16);

  const [formData, setFormData] = useState({
    foodName: '',
    description: '',
    category: 'Cooked Meals',
    dietaryType: 'Vegetarian',
    quantity: '',
    servings: '',
    cookedTime: defaultCooked,
    expiryTime: defaultExpiry,
    storageInstruction: 'Keep Hot',
    pickupAddress: user?.address || '',
    pickupCity: user?.city || 'Bengaluru',
    pickupWindowFrom: '14:00',
    pickupWindowTo: '20:00',
    contactPhone: user?.phone || '',
    imageUrl: PHOTO_PRESETS[0].url,
    safetyCertified: false,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await donationService.uploadImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: res.imageUrl }));
      showToast('Food image uploaded successfully!', 'success');
    } catch {
      showToast('Image upload failed, using preset instead', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (
      !formData.foodName ||
      !formData.quantity ||
      !formData.servings ||
      !formData.pickupAddress ||
      !formData.pickupCity
    ) {
      setError('Please fill in all mandatory fields');
      return;
    }

    if (!formData.safetyCertified) {
      setError('You must confirm the food safety and hygiene declaration');
      return;
    }

    if (new Date(formData.expiryTime) <= new Date()) {
      setError('Safe consumption deadline must be a future time');
      return;
    }

    try {
      setIsSubmitting(true);
      await donationService.createDonation({
        foodName: formData.foodName,
        description: formData.description,
        category: formData.category,
        dietaryType: formData.dietaryType,
        quantity: formData.quantity,
        servings: Number(formData.servings),
        cookedTime: formData.cookedTime,
        expiryTime: formData.expiryTime,
        storageInstruction: formData.storageInstruction,
        pickupAddress: formData.pickupAddress,
        pickupCity: formData.pickupCity,
        pickupWindow: {
          from: formData.pickupWindowFrom,
          to: formData.pickupWindowTo,
        },
        contactPhone: formData.contactPhone,
        imageUrl: formData.imageUrl,
        safetyCertified: true,
      });

      showToast('Surplus food donation listed successfully! NGOs are being alerted.', 'success');
      navigate('/donor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to list donation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="text-center sm:text-left space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
          List Surplus Food Batch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Post Food Donation
        </h1>
        <p className="text-sm text-slate-500">
          Share your banquet, restaurant, or hostel surplus with verified local shelters and orphanages.
        </p>
      </div>

      {/* Prominent Food Safety Warning Card */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-7 shadow-sm space-y-3">
        <div className="flex items-center gap-2.5 text-amber-900 font-bold text-base">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span>Strict Food Safety & Hygiene Charter</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
          <strong>DO NOT list spoiled, sour, foul-smelling, or unsafe food.</strong> All donations must be wholesome,
          prepared in a sanitized kitchen, and maintained at safe temperatures (&gt;65°C for hot meals or &lt;5°C for cold
          storage). Partner NGOs and volunteers conduct visual and temperature checks upon collection.
        </p>
      </div>

      {/* Main Donation Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl shadow-slate-100 space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs sm:text-sm flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Food Details Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <UtensilsCrossed className="w-5 h-5 text-brand-600" />
            <span>1. Food Item Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Food Batch Title *
              </label>
              <input
                type="text"
                name="foodName"
                value={formData.foodName}
                onChange={handleChange}
                placeholder="e.g. Royal Shahi Veg Biryani & Paneer Curry"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Food Description & Packaging Notes
              </label>
              <textarea
                rows="2"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g. Prepared for banquet lunch. Kept hot in commercial warmers. Packaged in sealed food-grade containers."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium bg-white"
              >
                <option value="Cooked Meals">Cooked Meals</option>
                <option value="Bakery & Snacks">Bakery & Snacks</option>
                <option value="Raw Groceries">Raw Groceries</option>
                <option value="Packaged Food">Packaged Food</option>
                <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                <option value="Beverages">Beverages</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dietary Preference *
              </label>
              <select
                name="dietaryType"
                value={formData.dietaryType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium bg-white"
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Eggetarian">Eggetarian</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Quantity *
              </label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g. 25 kg / 4 large containers / 50 packets"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estimated Servings / People Fed *
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="number"
                  min="1"
                  name="servings"
                  value={formData.servings}
                  onChange={handleChange}
                  placeholder="e.g. 60"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Timing & Safety Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Clock className="w-5 h-5 text-brand-600" />
            <span>2. Cooking Time & Expiry Deadline</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Food Preparation Time *
              </label>
              <input
                type="datetime-local"
                name="cookedTime"
                value={formData.cookedTime}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
              <span className="text-[11px] text-slate-400">When food was prepared</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Safe Consumption Deadline (Expiry) *
              </label>
              <input
                type="datetime-local"
                name="expiryTime"
                value={formData.expiryTime}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold text-amber-800"
                required
              />
              <span className="text-[11px] text-slate-400">Safe consumption limit</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Storage Instruction
              </label>
              <select
                name="storageInstruction"
                value={formData.storageInstruction}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="Keep Hot">Keep Hot (&gt;65°C)</option>
                <option value="Keep Refrigerated">Keep Refrigerated (&lt;5°C)</option>
                <option value="Room Temperature">Room Temperature</option>
                <option value="Dry Storage">Dry Storage</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Pickup Location & Contact */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <MapPin className="w-5 h-5 text-brand-600" />
            <span>3. Pickup Logistics & Window</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pickup Address & Loading Gate *
              </label>
              <input
                type="text"
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleChange}
                placeholder="e.g. Grand Royal Hotel, Gate 2 Kitchen Dock, 42 MG Road"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                City *
              </label>
              <input
                type="text"
                name="pickupCity"
                value={formData.pickupCity}
                onChange={handleChange}
                placeholder="e.g. Bengaluru"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pickup Available From
              </label>
              <input
                type="text"
                name="pickupWindowFrom"
                value={formData.pickupWindowFrom}
                onChange={handleChange}
                placeholder="14:00"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pickup Available Until
              </label>
              <input
                type="text"
                name="pickupWindowTo"
                value={formData.pickupWindowTo}
                onChange={handleChange}
                placeholder="20:00"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Donor Contact Phone *
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="+91 98123 45678"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
          </div>
        </div>

        {/* 4. Food Image Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <ImageIcon className="w-5 h-5 text-brand-600" />
            <span>4. Food Image (Photo or Presets)</span>
          </h2>

          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              Select one of our high-quality realistic food photo presets, enter a photo URL, or upload from your device:
            </p>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
              {PHOTO_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => setFormData((prev) => ({ ...prev, imageUrl: preset.url }))}
                  className={`group relative rounded-xl overflow-hidden border-2 transition-all p-1 text-left ${
                    formData.imageUrl === preset.url
                      ? 'border-brand-600 ring-2 ring-brand-100 bg-brand-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-16 object-cover rounded-lg group-hover:scale-105 transition-transform"
                  />
                  <span className="block text-[10px] font-bold text-slate-700 mt-1 truncate">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom URL or File Upload */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="Or paste an image URL here..."
                className="flex-1 w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
              />

              <label className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition">
                <Upload className="w-4 h-4 text-slate-500" />
                <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* 5. Mandatory Safety Declaration Checkbox */}
        <div className="p-5 rounded-2xl bg-brand-50 border border-brand-200 space-y-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="safetyCertified"
              checked={formData.safetyCertified}
              onChange={handleChange}
              className="mt-1 w-5 h-5 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
              required
            />
            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              <span className="font-bold text-slate-900 block">
                Mandatory Food Safety Certification *
              </span>
              I certify on behalf of my organization that this food has been prepared hygienically,
              stored under safe food temperature regulations, is completely safe and fit for human consumption,
              and does not contain spoiled or unsafe ingredients.
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/donor/dashboard')}
            className="px-5 py-3 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting || !formData.safetyCertified}
            className="px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Posting Donation...' : 'Publish Food Donation'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonateFoodPage;
