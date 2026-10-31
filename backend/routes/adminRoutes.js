const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUserStatus,
  getReportedDonations,
  resolveReport,
  deleteDonation,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id', updateUserStatus);
router.get('/reports', getReportedDonations);
router.put('/reports/:id/resolve', resolveReport);
router.delete('/donations/:id', deleteDonation);

module.exports = router;
