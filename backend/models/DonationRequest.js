const mongoose = require('mongoose');

const donationRequestSchema = new mongoose.Schema(
  {
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodDonation',
      required: true,
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    servingsRequested: {
      type: Number,
      required: [true, 'Please specify requested servings'],
      min: 1,
    },
    proposedPickupTime: {
      type: String,
      required: [true, 'Please provide estimated pickup time'],
    },
    volunteerName: {
      type: String,
      required: [true, 'Please provide volunteer / driver name'],
      trim: true,
    },
    volunteerPhone: {
      type: String,
      required: [true, 'Please provide volunteer phone number'],
      trim: true,
    },
    vehicleNumber: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
    verificationOtp: {
      type: String,
      default: () => Math.floor(1000 + Math.random() * 9000).toString(),
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Picked Up', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    responseNote: {
      type: String,
      default: '',
    },
    pickedUpAt: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    }
  },
  {
    timestamps: true,
  }
);

donationRequestSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('DonationRequest', donationRequestSchema);
