const bcrypt = require('bcryptjs');
const User = require('../models/User');
const FoodDonation = require('../models/FoodDonation');
const DonationRequest = require('../models/DonationRequest');
const TrackingLog = require('../models/TrackingLog');

const seedDatabase = async () => {
  try {
    console.log('[Seed] Seeding sample data for FoodBridge...');

    // Clear existing collections
    await User.deleteMany({});
    await FoodDonation.deleteMany({});
    await DonationRequest.deleteMany({});
    await TrackingLog.deleteMany({});

    const passwordHash = await bcrypt.hash('Password123!', 10);

    // 1. Create Users
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@foodbridge.org',
      password: passwordHash,
      role: 'admin',
      organizationName: 'FoodBridge Global Initiative',
      organizationType: 'Charitable Trust',
      phone: '+91 98765 43210',
      address: 'Suite 400, FoodBridge Tower, Tech Park',
      city: 'Bengaluru',
      isVerified: true,
      status: 'active',
    });

    const donor1 = await User.create({
      name: 'Chef Vikram Anand',
      email: 'donor@foodbridge.org',
      password: passwordHash,
      role: 'donor',
      organizationName: 'Grand Royal Hotel & Banquets',
      organizationType: 'Hotel',
      phone: '+91 98123 45678',
      address: '42 MG Road, Ashok Nagar',
      city: 'Bengaluru',
      isVerified: true,
      status: 'active',
    });

    const donor2 = await User.create({
      name: 'Anita Sharma',
      email: 'anita@greenleaf.com',
      password: passwordHash,
      role: 'donor',
      organizationName: 'The Green Leaf Caterers',
      organizationType: 'Catering Service',
      phone: '+91 98234 56789',
      address: '15 Indiranagar 100ft Road',
      city: 'Bengaluru',
      isVerified: true,
      status: 'active',
    });

    const donor3 = await User.create({
      name: 'Suresh Rao',
      email: 'suresh@heritagehall.com',
      password: passwordHash,
      role: 'donor',
      organizationName: 'Heritage Convention Center',
      organizationType: 'Function Hall',
      phone: '+91 98345 67890',
      address: '77 Bannerghatta Main Road',
      city: 'Bengaluru',
      isVerified: true,
      status: 'active',
    });

    const ngo1 = await User.create({
      name: 'Rajeshwari Patel',
      email: 'ngo@foodbridge.org',
      password: passwordHash,
      role: 'ngo',
      organizationName: 'Hope Child Care & Orphanage',
      organizationType: 'Orphanage',
      phone: '+91 98456 78901',
      address: '12 Koramangala 4th Block',
      city: 'Bengaluru',
      isVerified: true,
      status: 'active',
    });

    const ngo2 = await User.create({
      name: 'Sunil Kulkarni',
      email: 'sunil@annapurnaseva.org',
      password: passwordHash,
      role: 'ngo',
      organizationName: 'Annapurna Seva Trust',
      organizationType: 'NGO',
      phone: '+91 98567 89012',
      address: '88 Jayanagar 7th Block',
      city: 'Bengaluru',
      isVerified: true,
      status: 'active',
    });

    const ngo3 = await User.create({
      name: 'Kavita Nair',
      email: 'kavita@aashraya.org',
      password: passwordHash,
      role: 'ngo',
      organizationName: 'Aashraya Senior Living Care',
      organizationType: 'Old-Age Home',
      phone: '+91 98678 90123',
      address: '23 Whitefield Main Road',
      city: 'Bengaluru',
      isVerified: true,
      status: 'active',
    });

    // 2. Create Food Donations
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);
    const inFourHours = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    const inEightHours = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    const inTwelveHours = new Date(now.getTime() + 12 * 60 * 60 * 1000);
    const inTwentyFourHours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Donation 1: Available - Royal Banquet Veg Biryani & Paneer Butter Masala
    const donation1 = await FoodDonation.create({
      donor: donor1._id,
      foodName: 'Royal Shahi Biryani & Paneer Curry',
      description: 'Prepared for high-profile banquet event. Maintained in commercial warmers above 65°C. Cleanly packed in stainless food containers ready for transfer.',
      category: 'Cooked Meals',
      dietaryType: 'Vegetarian',
      quantity: '35 kg',
      servings: 80,
      cookedTime: twoHoursAgo,
      expiryTime: inEightHours,
      pickupAddress: 'Grand Royal Hotel, Loading Dock 2, 42 MG Road',
      pickupCity: 'Bengaluru',
      pickupWindow: { from: '14:00', to: '19:00' },
      contactPhone: '+91 98123 45678',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      safetyCertified: true,
      storageInstruction: 'Keep Hot',
      status: 'Available',
    });

    await TrackingLog.create({
      donation: donation1._id,
      status: 'Available',
      updatedBy: donor1._id,
      actorRole: 'donor',
      title: 'Food Donation Listed',
      note: 'Donation published by Grand Royal Hotel & Banquets. 80 servings available for immediate rescue.',
      timestamp: twoHoursAgo,
    });

    // Donation 2: Available - Assorted Artisanal Bread, Croissants & Buns
    const donation2 = await FoodDonation.create({
      donor: donor2._id,
      foodName: 'Bakery Surplus: Croissants, Buns & Loaves',
      description: 'Fresh morning bake surplus from catering buffet. Packaged individually in eco-friendly paper bags. Ideal for afternoon snacks or breakfasts.',
      category: 'Bakery & Snacks',
      dietaryType: 'Vegetarian',
      quantity: '50 units',
      servings: 50,
      cookedTime: fourHoursAgo,
      expiryTime: inTwentyFourHours,
      pickupAddress: 'The Green Leaf Caterers, 15 Indiranagar 100ft Road',
      pickupCity: 'Bengaluru',
      pickupWindow: { from: '11:00', to: '20:00' },
      contactPhone: '+91 98234 56789',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      safetyCertified: true,
      storageInstruction: 'Room Temperature',
      status: 'Available',
    });

    await TrackingLog.create({
      donation: donation2._id,
      status: 'Available',
      updatedBy: donor2._id,
      actorRole: 'donor',
      title: 'Food Donation Listed',
      note: 'Donation published by The Green Leaf Caterers. 50 servings available.',
      timestamp: fourHoursAgo,
    });

    // Donation 3: Requested - Wedding Feast South Indian Meals
    const donation3 = await FoodDonation.create({
      donor: donor3._id,
      foodName: 'Traditional South Indian Feast (Sambar, Rice, Poriyal)',
      description: 'Wholesome vegetarian feast prepared for afternoon wedding reception. Kept covered and sealed, includes freshly cooked rice, sambar, rasam, and mixed vegetable poriyal.',
      category: 'Cooked Meals',
      dietaryType: 'Vegetarian',
      quantity: '45 kg',
      servings: 120,
      cookedTime: twoHoursAgo,
      expiryTime: inSixHours = inFourHours,
      pickupAddress: 'Heritage Convention Center, Gate 3 Kitchen, 77 Bannerghatta Road',
      pickupCity: 'Bengaluru',
      pickupWindow: { from: '15:00', to: '18:30' },
      contactPhone: '+91 98345 67890',
      imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80',
      safetyCertified: true,
      storageInstruction: 'Keep Hot',
      status: 'Requested',
    });

    await TrackingLog.create({
      donation: donation3._id,
      status: 'Available',
      updatedBy: donor3._id,
      actorRole: 'donor',
      title: 'Food Donation Listed',
      note: '120 servings listed by Heritage Convention Center.',
      timestamp: twoHoursAgo,
    });

    const reqFor3 = await DonationRequest.create({
      donation: donation3._id,
      donor: donor3._id,
      ngo: ngo1._id,
      servingsRequested: 100,
      proposedPickupTime: '16:30 Today',
      volunteerName: 'Ramesh Kumar',
      volunteerPhone: '+91 98999 11111',
      vehicleNumber: 'KA-05-EA-8842',
      message: 'We can distribute these 100 meals to our 75 children and neighboring community elders immediately.',
      verificationOtp: '7412',
      status: 'Pending',
    });

    await TrackingLog.create({
      donation: donation3._id,
      status: 'Requested',
      updatedBy: ngo1._id,
      actorRole: 'ngo',
      title: 'Donation Requested',
      note: 'Hope Child Care & Orphanage requested 100 servings for evening meal distribution.',
      timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000),
    });

    // Donation 4: Accepted (Ready for Pickup) - Continental Pasta & Garlic Rolls
    const donation4 = await FoodDonation.create({
      donor: donor1._id,
      foodName: 'Creamy Penne Alfredo & Garlic Herb Rolls',
      description: 'Prepared for corporate conference lunch. Pasta sealed in thermal meal trays, garlic bread individually wrapped.',
      category: 'Cooked Meals',
      dietaryType: 'Vegetarian',
      quantity: '20 kg',
      servings: 45,
      cookedTime: threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000),
      expiryTime: inTwelveHours,
      pickupAddress: 'Grand Royal Hotel, 42 MG Road',
      pickupCity: 'Bengaluru',
      pickupWindow: { from: '16:00', to: '19:00' },
      contactPhone: '+91 98123 45678',
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d62810b4?auto=format&fit=crop&w=800&q=80',
      safetyCertified: true,
      storageInstruction: 'Keep Refrigerated',
      status: 'Accepted',
      assignedNgo: ngo2._id,
    });

    const reqFor4 = await DonationRequest.create({
      donation: donation4._id,
      donor: donor1._id,
      ngo: ngo2._id,
      servingsRequested: 45,
      proposedPickupTime: '17:00 Today',
      volunteerName: 'Deepak Varma',
      volunteerPhone: '+91 98888 22222',
      vehicleNumber: 'KA-01-MJ-5519',
      message: 'Our outreach team will serve these meals to slum residents near City Central.',
      verificationOtp: '3924',
      status: 'Accepted',
      responseNote: 'Please arrive at Gate 2 loading zone before 18:00.',
    });

    donation4.acceptedRequest = reqFor4._id;
    await donation4.save();

    await TrackingLog.create({
      donation: donation4._id,
      status: 'Available',
      updatedBy: donor1._id,
      actorRole: 'donor',
      title: 'Food Donation Listed',
      note: '45 servings listed.',
      timestamp: threeHoursAgo,
    });
    await TrackingLog.create({
      donation: donation4._id,
      status: 'Requested',
      updatedBy: ngo2._id,
      actorRole: 'ngo',
      title: 'Donation Requested',
      note: 'Annapurna Seva Trust requested 45 servings.',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    });
    await TrackingLog.create({
      donation: donation4._id,
      status: 'Accepted',
      updatedBy: donor1._id,
      actorRole: 'donor',
      title: 'Request Accepted',
      note: 'Donor accepted request from Annapurna Seva Trust. OTP: 3924.',
      timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000),
    });

    // Donation 5: Delivered - Fresh Farm Produce (Tomatoes & Apples)
    const yesterday = new Date(now.getTime() - 26 * 60 * 60 * 1000);
    const donation5 = await FoodDonation.create({
      donor: donor2._id,
      foodName: 'Fresh Apples, Oranges & Green Salads',
      description: 'High quality surplus fruits and pre-washed fresh salads from conference banquet spread.',
      category: 'Fruits & Vegetables',
      dietaryType: 'Vegan',
      quantity: '40 kg',
      servings: 90,
      cookedTime: yesterday,
      expiryTime: new Date(now.getTime() + 18 * 60 * 60 * 1000),
      pickupAddress: 'The Green Leaf Caterers, 15 Indiranagar 100ft Road',
      pickupCity: 'Bengaluru',
      pickupWindow: { from: '09:00', to: '14:00' },
      contactPhone: '+91 98234 56789',
      imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
      safetyCertified: true,
      storageInstruction: 'Room Temperature',
      status: 'Delivered',
      assignedNgo: ngo3._id,
    });

    const reqFor5 = await DonationRequest.create({
      donation: donation5._id,
      donor: donor2._id,
      ngo: ngo3._id,
      servingsRequested: 90,
      proposedPickupTime: 'Yesterday 11:30',
      volunteerName: 'Manoj Kumar',
      volunteerPhone: '+91 97777 33333',
      vehicleNumber: 'KA-04-TC-1234',
      message: 'For 60 residents of Aashraya Senior Care home and staff.',
      verificationOtp: '8152',
      status: 'Delivered',
      responseNote: 'Handed over in refrigerated crates.',
      pickedUpAt: new Date(now.getTime() - 20 * 60 * 60 * 1000),
      deliveredAt: new Date(now.getTime() - 18 * 60 * 60 * 1000),
    });

    donation5.acceptedRequest = reqFor5._id;
    await donation5.save();

    await TrackingLog.create({
      donation: donation5._id,
      status: 'Delivered',
      updatedBy: ngo3._id,
      actorRole: 'ngo',
      title: 'Meals Delivered Successfully',
      note: '90 servings of fresh fruit and salads enjoyed by elderly residents at Aashraya Senior Care.',
      timestamp: new Date(now.getTime() - 18 * 60 * 60 * 1000),
    });

    console.log('[Seed] Database successfully seeded with test donors, NGOs, admin, and realistic food donations!');
  } catch (err) {
    console.error('[Seed] Error seeding database:', err);
  }
};

// If run directly from CLI
if (require.main === module) {
  require('dotenv').config({ path: '../.env' });
  const { connectDB, disconnectDB } = require('../config/db');

  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      await disconnectDB();
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  })();
}

module.exports = { seedDatabase };
