const dataService = require('../services/dataService');

// @desc    Create a new food donation
// @route   POST /api/donations
// @access  Private (Donor, Admin)
const createDonation = async (req, res, next) => {
  try {
    const {
      foodName,
      description,
      category,
      dietaryType,
      quantity,
      servings,
      cookedTime,
      expiryTime,
      pickupAddress,
      pickupCity,
      pickupWindow,
      contactPhone,
      imageUrl,
      safetyCertified,
      storageInstruction,
    } = req.body;

    if (!foodName || !quantity || !servings || !cookedTime || !expiryTime || !pickupAddress || !pickupCity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory food and pickup details',
      });
    }

    if (!safetyCertified) {
      return res.status(400).json({
        success: false,
        message: 'You must certify that the food is fresh, safely stored, and hygienic',
      });
    }

    if (new Date(expiryTime) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Safe consumption deadline must be a future time',
      });
    }

    const donation = await dataService.createDonation(
      {
        foodName,
        description: description || '',
        category: category || 'Cooked Meals',
        dietaryType: dietaryType || 'Vegetarian',
        quantity,
        servings: Number(servings),
        cookedTime: new Date(cookedTime),
        expiryTime: new Date(expiryTime),
        pickupAddress,
        pickupCity,
        pickupWindow: pickupWindow || { from: '09:00', to: '21:00' },
        contactPhone: contactPhone || req.user.phone,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        safetyCertified: true,
        storageInstruction: storageInstruction || 'Room Temperature',
      },
      req.user
    );

    res.status(201).json({
      success: true,
      message: 'Food donation posted successfully!',
      donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all food donations with filtering & search
// @route   GET /api/donations
// @access  Public
const getDonations = async (req, res, next) => {
  try {
    const { search, category, dietaryType, city, status = 'Available', sortBy = 'urgency' } = req.query;

    const donations = await dataService.getDonations({
      search,
      category,
      dietaryType,
      city,
      status,
      sortBy,
    });

    res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single donation by ID
// @route   GET /api/donations/:id
// @access  Public / Private
const getDonationById = async (req, res, next) => {
  try {
    const result = await dataService.getDonationById(req.params.id);

    if (!result || !result.donation) {
      return res.status(404).json({
        success: false,
        message: 'Food donation listing not found',
      });
    }

    const { donation, trackingLogs, requests } = result;

    res.status(200).json({
      success: true,
      donation,
      trackingLogs: trackingLogs || [],
      requests: requests || [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get donor's own donations
// @route   GET /api/donations/my-donations
// @access  Private (Donor, Admin)
const getMyDonations = async (req, res, next) => {
  try {
    const donations = await dataService.getMyDonations(req.user);

    res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update eligible donation
// @route   PUT /api/donations/:id
// @access  Private (Donor, Admin)
const updateDonation = async (req, res, next) => {
  try {
    const donation = await dataService.updateDonation(req.params.id, req.body, req.user);

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Donation updated successfully',
      donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel donation
// @route   PUT /api/donations/:id/cancel
// @access  Private (Donor, Admin)
const cancelDonation = async (req, res, next) => {
  try {
    const { reason = 'Cancelled by donor' } = req.body;
    const donation = await dataService.cancelDonation(req.params.id, reason, req.user);

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Donation cancelled successfully',
      donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Report listing
// @route   POST /api/donations/:id/report
// @access  Private
const reportDonation = async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ success: false, message: 'Please provide a reason for reporting' });
    }

    if (global.isUsingMemoryStore) {
      const memoryStore = require('../config/memoryStore');
      const d = memoryStore.donations.find((item) => item._id === req.params.id || item.id === req.params.id);
      if (d) {
        d.reportsCount = (d.reportsCount || 0) + 1;
        d.reportReason = reason;
      }
    } else {
      const FoodDonation = require('../models/FoodDonation');
      await FoodDonation.findByIdAndUpdate(req.params.id, {
        $inc: { reportsCount: 1 },
        $set: { reportReason: reason },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report submitted. Our safety team will review this listing shortly.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDonation,
  getDonations,
  getDonationById,
  getMyDonations,
  updateDonation,
  cancelDonation,
  reportDonation,
};
