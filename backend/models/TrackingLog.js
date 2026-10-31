const mongoose = require('mongoose');

const trackingLogSchema = new mongoose.Schema(
  {
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodDonation',
      required: true,
    },
    status: {
      type: String,
      enum: ['Available', 'Requested', 'Accepted', 'Picked Up', 'Delivered', 'Cancelled'],
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    actorRole: {
      type: String,
      enum: ['donor', 'ngo', 'admin', 'system'],
      default: 'system',
    },
    title: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TrackingLog', trackingLogSchema);
