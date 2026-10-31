const dataService = require('../services/dataService');
const memoryStore = require('../config/memoryStore');
const User = require('../models/User');
const FoodDonation = require('../models/FoodDonation');
const DonationRequest = require('../models/DonationRequest');

// @desc    Get all users with filtering
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, status, search } = req.query;
    const users = await dataService.getAllUsers({ role, status, search });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user verification or status (active/suspended)
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
const updateUserStatus = async (req, res, next) => {
  try {
    const { status, isVerified } = req.body;
    const updates = {};
    if (status !== undefined) updates.status = status;
    if (isVerified !== undefined) updates.isVerified = isVerified;

    const user = await dataService.updateUser(req.params.id, updates);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: `User status updated successfully`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reported listings
// @route   GET /api/admin/reports
// @access  Private (Admin)
const getReportedDonations = async (req, res, next) => {
  try {
    if (global.isUsingMemoryStore) {
      const reports = memoryStore.donations.filter((d) => d.reportsCount > 0);
      return res.status(200).json({
        success: true,
        count: reports.length,
        donations: reports,
      });
    }

    const donations = await FoodDonation.find({ reportsCount: { $gt: 0 } })
      .populate('donor', 'name organizationName phone email')
      .sort({ reportsCount: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Dismiss or resolve report on donation
// @route   PUT /api/admin/reports/:id/resolve
// @access  Private (Admin)
const resolveReport = async (req, res, next) => {
  try {
    if (global.isUsingMemoryStore) {
      const d = memoryStore.donations.find((item) => item._id === req.params.id || item.id === req.params.id);
      if (d) {
        d.reportsCount = 0;
        d.reportReason = '';
      }
      return res.status(200).json({
        success: true,
        message: 'Report resolved and listing cleared.',
        donation: d,
      });
    }

    const donation = await FoodDonation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    donation.reportsCount = 0;
    donation.reportReason = '';
    await donation.save();

    res.status(200).json({
      success: true,
      message: 'Report resolved and listing cleared.',
      donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin delete / cancel donation
// @route   DELETE /api/admin/donations/:id
// @access  Private (Admin)
const deleteDonation = async (req, res, next) => {
  try {
    if (global.isUsingMemoryStore) {
      const d = memoryStore.donations.find((item) => item._id === req.params.id || item.id === req.params.id);
      if (d) {
        d.status = 'Cancelled';
      }
      return res.status(200).json({
        success: true,
        message: 'Listing removed by administrator.',
      });
    }

    const donation = await FoodDonation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    donation.status = 'Cancelled';
    await donation.save();

    await DonationRequest.updateMany(
      { donation: donation._id },
      { status: 'Cancelled', responseNote: 'Donation listing removed by administrator.' }
    );

    res.status(200).json({
      success: true,
      message: 'Listing removed by administrator.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  updateUserStatus,
  getReportedDonations,
  resolveReport,
  deleteDonation,
};
