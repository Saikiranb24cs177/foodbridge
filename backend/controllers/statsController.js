const dataService = require('../services/dataService');

// @desc    Get platform public & dashboard impact statistics
// @route   GET /api/stats
// @access  Public
const getPlatformStats = async (req, res, next) => {
  try {
    const stats = await dataService.getPlatformStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPlatformStats };
