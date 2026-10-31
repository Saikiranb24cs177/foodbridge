const express = require('express');
const router = express.Router();
const {
  createRequest,
  respondToRequest,
  updateLifecycleStatus,
  getMyRequests,
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/my-requests', protect, authorize('ngo', 'admin'), getMyRequests);
router.post('/', protect, authorize('ngo', 'admin'), createRequest);
router.put('/:id/respond', protect, authorize('donor', 'admin'), respondToRequest);
router.put('/:id/status', protect, updateLifecycleStatus);

module.exports = router;
