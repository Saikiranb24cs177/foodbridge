const bcrypt = require('bcryptjs');

class MemoryStore {
  constructor() {
    this.users = [];
    this.donations = [];
    this.requests = [];
    this.logs = [];
    this.isSeeded = false;
  }

  generateId() {
    return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
  }

  async seed() {
    if (this.isSeeded) return;

    const passwordHash = await bcrypt.hash('Password123!', 10);
    const now = new Date();

    // 1. Users
    const admin = {
      _id: 'usr_admin_01',
      id: 'usr_admin_01',
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
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    };

    const donor1 = {
      _id: 'usr_donor_01',
      id: 'usr_donor_01',
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
      createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
    };

    const donor2 = {
      _id: 'usr_donor_02',
      id: 'usr_donor_02',
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
      createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
    };

    const donor3 = {
      _id: 'usr_donor_03',
      id: 'usr_donor_03',
      name: 'Suresh Rao',
      email: 'suresh@heritagehall.com',
      password: passwordHash,
      role: 'donor',
      organizationName: 'Heritage Convention Center',
      organizationType: 'Function Hall',
      phone: '+91 98345 67890',
      address: '77 Bannerghatta Road',
      city: 'Bengaluru',
      isVerified: true,
      status: 'active',
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
    };

    const ngo1 = {
      _id: 'usr_ngo_01',
      id: 'usr_ngo_01',
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
      createdAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000),
    };

    const ngo2 = {
      _id: 'usr_ngo_02',
      id: 'usr_ngo_02',
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
      createdAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
    };

    const ngo3 = {
      _id: 'usr_ngo_03',
      id: 'usr_ngo_03',
      name: 'Kavita Nair',
      email: 'kavita@aashraya.org',
      password: passwordHash,
      role: 'ngo',
      organizationName: 'Aashraya Senior Care Home',
      organizationType: 'Old-Age Home',
      phone: '+91 98678 90123',
      address: '23 Whitefield Main Road',
      city: 'Bengaluru',
      isVerified: true,
      status: 'active',
      createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
    };

    this.users = [admin, donor1, donor2, donor3, ngo1, ngo2, ngo3];

    // 2. Donations
    const don1 = {
      _id: 'don_01',
      id: 'don_01',
      donor: donor1,
      foodName: 'Royal Shahi Biryani & Paneer Curry',
      description: 'Prepared for high-profile banquet event. Kept in commercial food warmers above 65°C. Cleanly packaged in stainless food containers ready for transfer.',
      category: 'Cooked Meals',
      dietaryType: 'Vegetarian',
      quantity: '35 kg',
      servings: 80,
      cookedTime: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      expiryTime: new Date(now.getTime() + 8 * 60 * 60 * 1000),
      pickupAddress: 'Grand Royal Hotel, Loading Dock 2, 42 MG Road',
      pickupCity: 'Bengaluru',
      pickupWindow: { from: '14:00', to: '19:00' },
      contactPhone: '+91 98123 45678',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      safetyCertified: true,
      storageInstruction: 'Keep Hot',
      status: 'Available',
      reportsCount: 0,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    };

    const don2 = {
      _id: 'don_02',
      id: 'don_02',
      donor: donor2,
      foodName: 'Bakery Surplus: Croissants, Buns & Loaves',
      description: 'Fresh morning bake surplus from catering buffet. Packaged individually in eco-friendly paper bags. Ideal for afternoon snacks or breakfasts.',
      category: 'Bakery & Snacks',
      dietaryType: 'Vegetarian',
      quantity: '50 units',
      servings: 50,
      cookedTime: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      expiryTime: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      pickupAddress: 'The Green Leaf Caterers, 15 Indiranagar 100ft Road',
      pickupCity: 'Bengaluru',
      pickupWindow: { from: '11:00', to: '20:00' },
      contactPhone: '+91 98234 56789',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      safetyCertified: true,
      storageInstruction: 'Room Temperature',
      status: 'Available',
      reportsCount: 0,
      createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
    };

    const don3 = {
      _id: 'don_03',
      id: 'don_03',
      donor: donor3,
      foodName: 'Traditional South Indian Feast (Sambar, Rice, Poriyal)',
      description: 'Wholesome vegetarian feast prepared for afternoon wedding reception. Kept covered and sealed, includes freshly cooked rice, sambar, rasam, and mixed vegetable poriyal.',
      category: 'Cooked Meals',
      dietaryType: 'Vegetarian',
      quantity: '45 kg',
      servings: 120,
      cookedTime: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      expiryTime: new Date(now.getTime() + 5 * 60 * 60 * 1000),
      pickupAddress: 'Heritage Convention Center, Gate 3 Kitchen, 77 Bannerghatta Road',
      pickupCity: 'Bengaluru',
      pickupWindow: { from: '15:00', to: '18:30' },
      contactPhone: '+91 98345 67890',
      imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80',
      safetyCertified: true,
      storageInstruction: 'Keep Hot',
      status: 'Requested',
      reportsCount: 0,
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    };

    const don4 = {
      _id: 'don_04',
      id: 'don_04',
      donor: donor1,
      foodName: 'Creamy Penne Alfredo & Garlic Herb Rolls',
      description: 'Prepared for corporate conference lunch. Pasta sealed in thermal meal trays, garlic bread individually wrapped.',
      category: 'Cooked Meals',
      dietaryType: 'Vegetarian',
      quantity: '20 kg',
      servings: 45,
      cookedTime: new Date(now.getTime() - 5 * 60 * 60 * 1000),
      expiryTime: new Date(now.getTime() + 10 * 60 * 60 * 1000),
      pickupAddress: 'Grand Royal Hotel, 42 MG Road',
      pickupCity: 'Bengaluru',
      pickupWindow: { from: '16:00', to: '19:00' },
      contactPhone: '+91 98123 45678',
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d62810b4?auto=format&fit=crop&w=800&q=80',
      safetyCertified: true,
      storageInstruction: 'Keep Refrigerated',
      status: 'Accepted',
      assignedNgo: ngo2,
      reportsCount: 0,
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
    };

    const don5 = {
      _id: 'don_05',
      id: 'don_05',
      donor: donor2,
      foodName: 'Fresh Apples, Oranges & Green Salads',
      description: 'High quality surplus fruits and pre-washed fresh salads from conference banquet spread.',
      category: 'Fruits & Vegetables',
      dietaryType: 'Vegan',
      quantity: '40 kg',
      servings: 90,
      cookedTime: new Date(now.getTime() - 28 * 60 * 60 * 1000),
      expiryTime: new Date(now.getTime() + 18 * 60 * 60 * 1000),
      pickupAddress: 'The Green Leaf Caterers, 15 Indiranagar 100ft Road',
      pickupCity: 'Bengaluru',
      pickupWindow: { from: '09:00', to: '14:00' },
      contactPhone: '+91 98234 56789',
      imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
      safetyCertified: true,
      storageInstruction: 'Room Temperature',
      status: 'Delivered',
      assignedNgo: ngo3,
      reportsCount: 0,
      createdAt: new Date(now.getTime() - 28 * 60 * 60 * 1000),
    };

    this.donations = [don1, don2, don3, don4, don5];

    // 3. Requests
    const req1 = {
      _id: 'req_01',
      id: 'req_01',
      donation: don3,
      donor: donor3,
      ngo: ngo1,
      servingsRequested: 100,
      proposedPickupTime: '16:30 Today',
      volunteerName: 'Ramesh Kumar',
      volunteerPhone: '+91 98999 11111',
      vehicleNumber: 'KA-05-EA-8842',
      message: 'We will distribute these 100 meals to our 75 children and neighboring community elders immediately.',
      verificationOtp: '7412',
      status: 'Pending',
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
    };

    const req2 = {
      _id: 'req_02',
      id: 'req_02',
      donation: don4,
      donor: donor1,
      ngo: ngo2,
      servingsRequested: 45,
      proposedPickupTime: '17:00 Today',
      volunteerName: 'Deepak Varma',
      volunteerPhone: '+91 98888 22222',
      vehicleNumber: 'KA-01-MJ-5519',
      message: 'Our outreach team will serve these meals to homeless shelters near City Central.',
      verificationOtp: '3924',
      status: 'Accepted',
      responseNote: 'Please arrive at Gate 2 loading zone before 18:00.',
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    };
    don4.acceptedRequest = req2;

    const req3 = {
      _id: 'req_03',
      id: 'req_03',
      donation: don5,
      donor: donor2,
      ngo: ngo3,
      servingsRequested: 90,
      proposedPickupTime: 'Yesterday 11:30',
      volunteerName: 'Manoj Kumar',
      volunteerPhone: '+91 97777 33333',
      vehicleNumber: 'KA-04-TC-1234',
      message: 'For 60 residents of Aashraya Senior Care home and community staff.',
      verificationOtp: '8152',
      status: 'Delivered',
      responseNote: 'Handed over in refrigerated crates.',
      pickedUpAt: new Date(now.getTime() - 20 * 60 * 60 * 1000),
      deliveredAt: new Date(now.getTime() - 18 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 26 * 60 * 60 * 1000),
    };
    don5.acceptedRequest = req3;

    this.requests = [req1, req2, req3];

    // 4. Tracking Logs
    this.logs = [
      {
        _id: 'log_01',
        donation: 'don_01',
        status: 'Available',
        updatedBy: donor1,
        actorRole: 'donor',
        title: 'Food Donation Listed',
        note: 'Donation published by Grand Royal Hotel & Banquets. 80 servings available.',
        timestamp: don1.createdAt,
      },
      {
        _id: 'log_02',
        donation: 'don_02',
        status: 'Available',
        updatedBy: donor2,
        actorRole: 'donor',
        title: 'Food Donation Listed',
        note: 'Donation published by The Green Leaf Caterers. 50 servings available.',
        timestamp: don2.createdAt,
      },
      {
        _id: 'log_03',
        donation: 'don_03',
        status: 'Available',
        updatedBy: donor3,
        actorRole: 'donor',
        title: 'Food Donation Listed',
        note: '120 servings listed by Heritage Convention Center.',
        timestamp: don3.createdAt,
      },
      {
        _id: 'log_04',
        donation: 'don_03',
        status: 'Requested',
        updatedBy: ngo1,
        actorRole: 'ngo',
        title: 'Donation Requested',
        note: 'Hope Child Care requested 100 servings.',
        timestamp: req1.createdAt,
      },
      {
        _id: 'log_05',
        donation: 'don_04',
        status: 'Available',
        updatedBy: donor1,
        actorRole: 'donor',
        title: 'Food Donation Listed',
        note: '45 servings listed.',
        timestamp: don4.createdAt,
      },
      {
        _id: 'log_06',
        donation: 'don_04',
        status: 'Requested',
        updatedBy: ngo2,
        actorRole: 'ngo',
        title: 'Donation Requested',
        note: 'Annapurna Seva Trust requested 45 servings.',
        timestamp: req2.createdAt,
      },
      {
        _id: 'log_07',
        donation: 'don_04',
        status: 'Accepted',
        updatedBy: donor1,
        actorRole: 'donor',
        title: 'Request Accepted',
        note: 'Donor accepted request from Annapurna Seva Trust. Verification OTP: 3924.',
        timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      },
      {
        _id: 'log_08',
        donation: 'don_05',
        status: 'Available',
        updatedBy: donor2,
        actorRole: 'donor',
        title: 'Food Donation Listed',
        note: 'Fresh fruits listed.',
        timestamp: don5.createdAt,
      },
      {
        _id: 'log_09',
        donation: 'don_05',
        status: 'Picked Up',
        updatedBy: ngo3,
        actorRole: 'ngo',
        title: 'Food Picked Up',
        note: 'Picked up by Manoj Kumar.',
        timestamp: new Date(now.getTime() - 20 * 60 * 60 * 1000),
      },
      {
        _id: 'log_10',
        donation: 'don_05',
        status: 'Delivered',
        updatedBy: ngo3,
        actorRole: 'ngo',
        title: 'Meals Delivered Successfully',
        note: '90 servings distributed at Aashraya Senior Care Home.',
        timestamp: new Date(now.getTime() - 18 * 60 * 60 * 1000),
      },
    ];

    this.isSeeded = true;
    console.log('[MemoryStore] Seeded with 7 accounts, 5 realistic donations, 3 requests, and 10 tracking logs.');
  }
}

const memoryStore = new MemoryStore();
module.exports = memoryStore;
