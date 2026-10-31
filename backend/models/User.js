const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['donor', 'ngo', 'admin'],
      default: 'donor',
    },
    organizationName: {
      type: String,
      trim: true,
      default: '',
    },
    organizationType: {
      type: String,
      enum: [
        'Hotel',
        'Restaurant',
        'Hostel',
        'Function Hall',
        'Catering Service',
        'Corporate Cafeteria',
        'Supermarket',
        'NGO',
        'Orphanage',
        'Old-Age Home',
        'Community Shelter',
        'Charitable Trust',
        'Individual',
        'Other'
      ],
      default: 'Individual',
    },
    phone: {
      type: String,
      required: [true, 'Please provide a contact phone number'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide an address'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please provide your city'],
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    },
    avatar: {
      type: String,
      default: '',
    }
  },
  {
    timestamps: true,
  }
);

// Virtual for id mapping
userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
