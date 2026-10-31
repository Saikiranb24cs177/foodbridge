const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dataService = require('../services/dataService');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'foodbridge_super_secret_jwt_key_998811',
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );
};

// @desc    Register a new user (donor, ngo, admin)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = 'donor',
      organizationName,
      organizationType,
      phone,
      address,
      city,
    } = req.body;

    if (!name || !email || !password || !phone || !address || !city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, email, password, phone, address, city)',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const userExists = await dataService.findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await dataService.createUser({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      organizationName: organizationName || (role === 'donor' ? `${name}'s Kitchen` : `${name} Foundation`),
      organizationType: organizationType || (role === 'donor' ? 'Restaurant' : 'NGO'),
      phone,
      address,
      city,
      isVerified: true,
      status: 'active',
    });

    const token = generateToken(user._id || user.id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        _id: user._id || user.id,
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationName: user.organizationName,
        organizationType: user.organizationType,
        phone: user.phone,
        address: user.address,
        city: user.city,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await dataService.findUserByEmail(email, true);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact platform administrators.',
      });
    }

    const token = generateToken(user._id || user.id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        _id: user._id || user.id,
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationName: user.organizationName,
        organizationType: user.organizationType,
        phone: user.phone,
        address: user.address,
        city: user.city,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await dataService.findUserById(req.user._id || req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, city, organizationName, organizationType } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (address) updates.address = address;
    if (city) updates.city = city;
    if (organizationName) updates.organizationName = organizationName;
    if (organizationType) updates.organizationType = organizationType;

    const updatedUser = await dataService.updateUser(req.user._id || req.user.id, updates);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
};
