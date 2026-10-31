const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const memoryStore = require('../config/memoryStore');
const User = require('../models/User');
const FoodDonation = require('../models/FoodDonation');
const DonationRequest = require('../models/DonationRequest');
const TrackingLog = require('../models/TrackingLog');

const isMemory = () => Boolean(global.isUsingMemoryStore);

// User operations
const findUserByEmail = async (email, includePassword = false) => {
  if (isMemory()) {
    const user = memoryStore.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (!user) return null;
    return { ...user };
  }
  const q = User.findOne({ email: email.toLowerCase() });
  if (includePassword) q.select('+password');
  return await q.exec();
};

const findUserById = async (id) => {
  if (isMemory()) {
    const user = memoryStore.users.find((u) => u._id === id || u.id === id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  }
  return await User.findById(id).select('-password');
};

const createUser = async (userData) => {
  if (isMemory()) {
    const id = 'usr_' + memoryStore.generateId();
    const newUser = {
      _id: id,
      id: id,
      ...userData,
      isVerified: true,
      status: 'active',
      createdAt: new Date(),
    };
    memoryStore.users.push(newUser);
    const { password, ...safe } = newUser;
    return safe;
  }
  return await User.create(userData);
};

const updateUser = async (id, updates) => {
  if (isMemory()) {
    const idx = memoryStore.users.findIndex((u) => u._id === id || u.id === id);
    if (idx === -1) return null;
    memoryStore.users[idx] = { ...memoryStore.users[idx], ...updates, updatedAt: new Date() };
    const { password, ...safe } = memoryStore.users[idx];
    return safe;
  }
  return await User.findByIdAndUpdate(id, updates, { new: true });
};

const getAllUsers = async ({ role, status, search }) => {
  if (isMemory()) {
    let list = [...memoryStore.users];
    if (role && role !== 'all') list = list.filter((u) => u.role === role);
    if (status && status !== 'all') list = list.filter((u) => u.status === status);
    if (search && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.organizationName && u.organizationName.toLowerCase().includes(q)) ||
          (u.city && u.city.toLowerCase().includes(q))
      );
    }
    return list.map(({ password, ...u }) => u);
  }

  const query = {};
  if (role && role !== 'all') query.role = role;
  if (status && status !== 'all') query.status = status;
  if (search && search.trim()) {
    const regex = { $regex: search.trim(), $options: 'i' };
    query.$or = [{ name: regex }, { email: regex }, { organizationName: regex }, { city: regex }];
  }
  return await User.find(query).sort({ createdAt: -1 });
};

// Donation operations
const getDonations = async ({ search, category, dietaryType, city, status = 'Available', sortBy = 'urgency' }) => {
  if (isMemory()) {
    let list = [...memoryStore.donations];

    if (status && status !== 'all') {
      list = list.filter((d) => d.status === status);
    }

    if (category && category !== 'All') {
      list = list.filter((d) => d.category === category);
    }

    if (dietaryType && dietaryType !== 'All') {
      list = list.filter((d) => d.dietaryType === dietaryType);
    }

    if (city && city.trim()) {
      const c = city.toLowerCase();
      list = list.filter((d) => d.pickupCity && d.pickupCity.toLowerCase().includes(c));
    }

    if (search && search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.foodName.toLowerCase().includes(s) ||
          (d.description && d.description.toLowerCase().includes(s)) ||
          d.pickupCity.toLowerCase().includes(s) ||
          d.pickupAddress.toLowerCase().includes(s)
      );
    }

    if (sortBy === 'urgency') {
      list.sort((a, b) => new Date(a.expiryTime) - new Date(b.expiryTime));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'servings') {
      list.sort((a, b) => b.servings - a.servings);
    }

    return list;
  }

  const query = {};
  if (status && status !== 'all') query.status = status;
  if (category && category !== 'All') query.category = category;
  if (dietaryType && dietaryType !== 'All') query.dietaryType = dietaryType;
  if (city && city.trim()) query.pickupCity = { $regex: city.trim(), $options: 'i' };
  if (search && search.trim()) {
    const regex = { $regex: search.trim(), $options: 'i' };
    query.$or = [{ foodName: regex }, { description: regex }, { pickupAddress: regex }, { pickupCity: regex }];
  }

  let sort = { createdAt: -1 };
  if (sortBy === 'urgency') sort = { expiryTime: 1 };
  if (sortBy === 'servings') sort = { servings: -1 };

  return await FoodDonation.find(query)
    .populate('donor', 'name organizationName organizationType phone city')
    .populate('assignedNgo', 'name organizationName phone')
    .sort(sort);
};

const getDonationById = async (id) => {
  if (isMemory()) {
    const donation = memoryStore.donations.find((d) => d._id === id || d.id === id);
    if (!donation) return null;
    const trackingLogs = memoryStore.logs
      .filter((l) => l.donation === id || (l.donation && (l.donation._id === id || l.donation.id === id)))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const requests = memoryStore.requests.filter(
      (r) => (r.donation && (r.donation._id === id || r.donation.id === id)) || r.donation === id
    );
    return { donation, trackingLogs, requests };
  }

  const donation = await FoodDonation.findById(id)
    .populate('donor', 'name organizationName organizationType phone email city address')
    .populate('assignedNgo', 'name organizationName organizationType phone email')
    .populate('acceptedRequest');
  if (!donation) return null;

  const trackingLogs = await TrackingLog.find({ donation: donation._id })
    .populate('updatedBy', 'name organizationName role')
    .sort({ timestamp: 1 });

  const requests = await DonationRequest.find({ donation: donation._id })
    .populate('ngo', 'name organizationName organizationType phone email city isVerified')
    .sort({ createdAt: -1 });

  return { donation, trackingLogs, requests };
};

const createDonation = async (data, user) => {
  if (isMemory()) {
    const id = 'don_' + memoryStore.generateId();
    const newDonation = {
      _id: id,
      id: id,
      donor: {
        _id: user._id || user.id,
        id: user._id || user.id,
        name: user.name,
        organizationName: user.organizationName,
        organizationType: user.organizationType,
        phone: user.phone,
        city: user.city,
      },
      ...data,
      status: 'Available',
      reportsCount: 0,
      createdAt: new Date(),
    };
    memoryStore.donations.unshift(newDonation);

    // Create log
    const log = {
      _id: 'log_' + memoryStore.generateId(),
      donation: id,
      status: 'Available',
      updatedBy: user,
      actorRole: user.role,
      title: 'Food Donation Listed',
      note: `Donation created by ${user.organizationName || user.name}. ${data.servings} servings available.`,
      timestamp: new Date(),
    };
    memoryStore.logs.push(log);

    return newDonation;
  }

  const donation = await FoodDonation.create({
    donor: user._id,
    ...data,
    status: 'Available',
  });

  await TrackingLog.create({
    donation: donation._id,
    status: 'Available',
    updatedBy: user._id,
    actorRole: user.role,
    title: 'Food Donation Listed',
    note: `Donation created by ${user.organizationName || user.name}. ${data.servings} servings available.`,
  });

  return donation;
};

const getMyDonations = async (user) => {
  const userId = user._id || user.id;
  if (isMemory()) {
    const myDonations = memoryStore.donations.filter(
      (d) => (d.donor && (d.donor._id === userId || d.donor.id === userId)) || d.donor === userId
    );

    return myDonations.map((d) => {
      const relRequests = memoryStore.requests.filter(
        (r) => (r.donation && (r.donation._id === d._id || r.donation.id === d._id)) || r.donation === d._id
      );
      return {
        ...d,
        requestsCount: relRequests.length,
        pendingRequestsCount: relRequests.filter((r) => r.status === 'Pending').length,
        requests: relRequests,
      };
    });
  }

  const donations = await FoodDonation.find({ donor: userId })
    .populate('assignedNgo', 'name organizationName phone')
    .populate('acceptedRequest')
    .sort({ createdAt: -1 });

  const donationIds = donations.map((d) => d._id);
  const requests = await DonationRequest.find({ donation: { $in: donationIds } })
    .populate('ngo', 'name organizationName phone email city');

  return donations.map((d) => {
    const relRequests = requests.filter((r) => r.donation.toString() === d._id.toString());
    return {
      ...d.toObject(),
      requestsCount: relRequests.length,
      pendingRequestsCount: relRequests.filter((r) => r.status === 'Pending').length,
      requests: relRequests,
    };
  });
};

const updateDonation = async (id, updates, user) => {
  if (isMemory()) {
    const idx = memoryStore.donations.findIndex((d) => d._id === id || d.id === id);
    if (idx === -1) return null;
    const donation = memoryStore.donations[idx];

    // check auth
    const donorId = donation.donor?._id || donation.donor?.id || donation.donor;
    const userId = user._id || user.id;
    if (donorId !== userId && user.role !== 'admin') {
      throw new Error('Not authorized to modify this donation');
    }

    if (!['Available', 'Requested'].includes(donation.status)) {
      throw new Error(`Cannot edit donation once it has reached '${donation.status}' status`);
    }

    memoryStore.donations[idx] = {
      ...donation,
      ...updates,
      updatedAt: new Date(),
    };

    memoryStore.logs.push({
      _id: 'log_' + memoryStore.generateId(),
      donation: id,
      status: donation.status,
      updatedBy: user,
      actorRole: user.role,
      title: 'Donation Details Updated',
      note: 'Donor updated the food description and pickup details.',
      timestamp: new Date(),
    });

    return memoryStore.donations[idx];
  }

  const donation = await FoodDonation.findById(id);
  if (!donation) return null;
  if (donation.donor.toString() !== user._id.toString() && user.role !== 'admin') {
    throw new Error('Not authorized to modify this donation');
  }
  if (!['Available', 'Requested'].includes(donation.status)) {
    throw new Error(`Cannot edit donation once it has reached '${donation.status}' status`);
  }

  Object.assign(donation, updates);
  await donation.save();

  await TrackingLog.create({
    donation: donation._id,
    status: donation.status,
    updatedBy: user._id,
    actorRole: user.role,
    title: 'Donation Details Updated',
    note: 'Donor updated the food description and pickup details.',
  });

  return donation;
};

const cancelDonation = async (id, reason, user) => {
  if (isMemory()) {
    const idx = memoryStore.donations.findIndex((d) => d._id === id || d.id === id);
    if (idx === -1) return null;
    const donation = memoryStore.donations[idx];
    const donorId = donation.donor?._id || donation.donor?.id || donation.donor;
    const userId = user._id || user.id;

    if (donorId !== userId && user.role !== 'admin') {
      throw new Error('Not authorized');
    }

    if (['Delivered', 'Cancelled'].includes(donation.status)) {
      throw new Error(`Donation is already ${donation.status.toLowerCase()}`);
    }

    donation.status = 'Cancelled';

    // cancel pending requests
    memoryStore.requests.forEach((r) => {
      const reqDonId = r.donation?._id || r.donation?.id || r.donation;
      if (reqDonId === id && ['Pending', 'Accepted'].includes(r.status)) {
        r.status = 'Cancelled';
        r.responseNote = reason;
      }
    });

    memoryStore.logs.push({
      _id: 'log_' + memoryStore.generateId(),
      donation: id,
      status: 'Cancelled',
      updatedBy: user,
      actorRole: user.role,
      title: 'Donation Cancelled',
      note: reason || 'Cancelled by donor',
      timestamp: new Date(),
    });

    return donation;
  }

  const donation = await FoodDonation.findById(id);
  if (!donation) return null;
  if (donation.donor.toString() !== user._id.toString() && user.role !== 'admin') {
    throw new Error('Not authorized');
  }
  if (['Delivered', 'Cancelled'].includes(donation.status)) {
    throw new Error(`Donation is already ${donation.status.toLowerCase()}`);
  }

  donation.status = 'Cancelled';
  await donation.save();

  await DonationRequest.updateMany(
    { donation: donation._id, status: { $in: ['Pending', 'Accepted'] } },
    { status: 'Cancelled', responseNote: reason }
  );

  await TrackingLog.create({
    donation: donation._id,
    status: 'Cancelled',
    updatedBy: user._id,
    actorRole: user.role,
    title: 'Donation Cancelled',
    note: reason,
  });

  return donation;
};

// Request operations
const createRequest = async (data, user) => {
  const userId = user._id || user.id;
  if (isMemory()) {
    const donation = memoryStore.donations.find((d) => d._id === data.donationId || d.id === data.donationId);
    if (!donation) throw new Error('Donation listing not found');

    if (!['Available', 'Requested'].includes(donation.status)) {
      throw new Error(`This donation is no longer available (current status: ${donation.status})`);
    }

    const existing = memoryStore.requests.find((r) => {
      const donId = r.donation?._id || r.donation?.id || r.donation;
      const ngoId = r.ngo?._id || r.ngo?.id || r.ngo;
      return donId === data.donationId && ngoId === userId && ['Pending', 'Accepted'].includes(r.status);
    });

    if (existing) {
      throw new Error('You have already submitted an active request for this donation');
    }

    const reqId = 'req_' + memoryStore.generateId();
    const newRequest = {
      _id: reqId,
      id: reqId,
      donation: donation,
      donor: donation.donor,
      ngo: user,
      servingsRequested: Number(data.servingsRequested),
      proposedPickupTime: data.proposedPickupTime,
      volunteerName: data.volunteerName,
      volunteerPhone: data.volunteerPhone,
      vehicleNumber: data.vehicleNumber || 'N/A',
      message: data.message || '',
      verificationOtp: Math.floor(1000 + Math.random() * 9000).toString(),
      status: 'Pending',
      createdAt: new Date(),
    };

    memoryStore.requests.push(newRequest);

    if (donation.status === 'Available') {
      donation.status = 'Requested';
    }

    memoryStore.logs.push({
      _id: 'log_' + memoryStore.generateId(),
      donation: donation._id,
      status: 'Requested',
      updatedBy: user,
      actorRole: user.role,
      title: 'Donation Requested',
      note: `${user.organizationName || user.name} requested ${data.servingsRequested} servings. Pickup: ${data.proposedPickupTime}`,
      timestamp: new Date(),
    });

    return newRequest;
  }

  const donation = await FoodDonation.findById(data.donationId).populate('donor');
  if (!donation) throw new Error('Donation listing not found');
  if (!['Available', 'Requested'].includes(donation.status)) {
    throw new Error(`This donation is no longer available (current status: ${donation.status})`);
  }

  const existing = await DonationRequest.findOne({
    donation: data.donationId,
    ngo: user._id,
    status: { $in: ['Pending', 'Accepted'] },
  });
  if (existing) {
    throw new Error('You have already submitted an active request for this donation');
  }

  const request = await DonationRequest.create({
    donation: data.donationId,
    donor: donation.donor._id,
    ngo: user._id,
    servingsRequested: Number(data.servingsRequested),
    proposedPickupTime: data.proposedPickupTime,
    volunteerName: data.volunteerName,
    volunteerPhone: data.volunteerPhone,
    vehicleNumber: data.vehicleNumber || 'N/A',
    message: data.message || '',
    status: 'Pending',
  });

  if (donation.status === 'Available') {
    donation.status = 'Requested';
    await donation.save();
  }

  await TrackingLog.create({
    donation: donation._id,
    status: 'Requested',
    updatedBy: user._id,
    actorRole: user.role,
    title: 'Donation Requested',
    note: `${user.organizationName || user.name} requested ${data.servingsRequested} servings. Pickup: ${data.proposedPickupTime}`,
  });

  return request;
};

const respondToRequest = async (requestId, action, responseNote, user) => {
  const userId = user._id || user.id;

  if (isMemory()) {
    const request = memoryStore.requests.find((r) => r._id === requestId || r.id === requestId);
    if (!request) throw new Error('Request not found');

    const donorId = request.donor?._id || request.donor?.id || request.donor;
    if (donorId !== userId && user.role !== 'admin') {
      throw new Error('Not authorized to respond to this request');
    }

    if (request.status !== 'Pending') {
      throw new Error(`This request is already ${request.status.toLowerCase()}`);
    }

    const donId = request.donation?._id || request.donation?.id || request.donation;
    const donation = memoryStore.donations.find((d) => d._id === donId || d.id === donId);

    if (action === 'accept') {
      request.status = 'Accepted';
      request.responseNote = responseNote || 'Accepted by donor. Please arrive on time.';
      donation.status = 'Accepted';
      donation.assignedNgo = request.ngo;
      donation.acceptedRequest = request;

      // Reject others
      memoryStore.requests.forEach((r) => {
        const rDonId = r.donation?._id || r.donation?.id || r.donation;
        if (rDonId === donId && r._id !== requestId && r.status === 'Pending') {
          r.status = 'Rejected';
          r.responseNote = 'Another organization was matched for this batch.';
        }
      });

      memoryStore.logs.push({
        _id: 'log_' + memoryStore.generateId(),
        donation: donation._id,
        status: 'Accepted',
        updatedBy: user,
        actorRole: user.role,
        title: 'Request Accepted',
        note: `Approved request for ${request.ngo?.organizationName || request.ngo?.name}. PIN: ${request.verificationOtp}`,
        timestamp: new Date(),
      });

      return request;
    } else {
      request.status = 'Rejected';
      request.responseNote = responseNote || 'Declined by donor';

      const remainingPending = memoryStore.requests.filter((r) => {
        const rDonId = r.donation?._id || r.donation?.id || r.donation;
        return rDonId === donId && r.status === 'Pending';
      });

      if (remainingPending.length === 0) {
        donation.status = 'Available';
      }

      memoryStore.logs.push({
        _id: 'log_' + memoryStore.generateId(),
        donation: donation._id,
        status: donation.status,
        updatedBy: user,
        actorRole: user.role,
        title: 'Request Declined',
        note: `Donor declined request from ${request.ngo?.organizationName || request.ngo?.name}.`,
        timestamp: new Date(),
      });

      return request;
    }
  }

  const request = await DonationRequest.findById(requestId)
    .populate('donation')
    .populate('ngo', 'name organizationName phone email')
    .populate('donor', 'name organizationName phone');

  if (!request) throw new Error('Request not found');
  if (request.donor._id.toString() !== user._id.toString() && user.role !== 'admin') {
    throw new Error('Not authorized to respond to this request');
  }
  if (request.status !== 'Pending') {
    throw new Error(`This request is already ${request.status.toLowerCase()}`);
  }

  const donation = await FoodDonation.findById(request.donation._id);

  if (action === 'accept') {
    request.status = 'Accepted';
    request.responseNote = responseNote || 'Accepted by donor. Please arrive on time.';
    await request.save();

    donation.status = 'Accepted';
    donation.assignedNgo = request.ngo._id;
    donation.acceptedRequest = request._id;
    await donation.save();

    await DonationRequest.updateMany(
      { donation: donation._id, _id: { $ne: request._id }, status: 'Pending' },
      { status: 'Rejected', responseNote: 'Another organization was matched for this batch.' }
    );

    await TrackingLog.create({
      donation: donation._id,
      status: 'Accepted',
      updatedBy: user._id,
      actorRole: user.role,
      title: 'Request Accepted',
      note: `Approved request for ${request.ngo.organizationName || request.ngo.name}. PIN: ${request.verificationOtp}`,
    });

    return request;
  } else {
    request.status = 'Rejected';
    request.responseNote = responseNote || 'Declined by donor';
    await request.save();

    const pendingCount = await DonationRequest.countDocuments({ donation: donation._id, status: 'Pending' });
    if (pendingCount === 0) {
      donation.status = 'Available';
      await donation.save();
    }

    await TrackingLog.create({
      donation: donation._id,
      status: donation.status,
      updatedBy: user._id,
      actorRole: user.role,
      title: 'Request Declined',
      note: `Donor declined request from ${request.ngo.organizationName || request.ngo.name}.`,
    });

    return request;
  }
};

const updateLifecycleStatus = async (requestId, status, note, otp, user) => {
  const userId = user._id || user.id;

  if (isMemory()) {
    const request = memoryStore.requests.find((r) => r._id === requestId || r.id === requestId);
    if (!request) throw new Error('Request not found');

    const donId = request.donation?._id || request.donation?.id || request.donation;
    const donation = memoryStore.donations.find((d) => d._id === donId || d.id === donId);

    if (status === 'Picked Up') {
      if (request.status !== 'Accepted') {
        throw new Error('Can only mark Picked Up after donation is Accepted');
      }
      if (otp && otp.trim() !== request.verificationOtp) {
        throw new Error('Invalid verification OTP provided');
      }

      request.status = 'Picked Up';
      request.pickedUpAt = new Date();
      donation.status = 'Picked Up';

      memoryStore.logs.push({
        _id: 'log_' + memoryStore.generateId(),
        donation: donation._id,
        status: 'Picked Up',
        updatedBy: user,
        actorRole: user.role,
        title: 'Food Picked Up',
        note: note || `Volunteer ${request.volunteerName} collected food. In transit.`,
        timestamp: new Date(),
      });

      return request;
    }

    if (status === 'Delivered') {
      if (request.status !== 'Picked Up') {
        throw new Error('Can only mark Delivered after food is Picked Up');
      }

      request.status = 'Delivered';
      request.deliveredAt = new Date();
      donation.status = 'Delivered';

      memoryStore.logs.push({
        _id: 'log_' + memoryStore.generateId(),
        donation: donation._id,
        status: 'Delivered',
        updatedBy: user,
        actorRole: user.role,
        title: 'Meals Successfully Delivered',
        note: note || `All ${donation.servings} meals reached beneficiaries safely via ${request.ngo?.organizationName || request.ngo?.name}.`,
        timestamp: new Date(),
      });

      return request;
    }

    if (status === 'Cancelled') {
      request.status = 'Cancelled';
      request.responseNote = note || 'Cancelled';
      if (donation.acceptedRequest && (donation.acceptedRequest._id === requestId || donation.acceptedRequest.id === requestId)) {
        donation.status = 'Available';
        donation.assignedNgo = null;
        donation.acceptedRequest = null;
      }
      memoryStore.logs.push({
        _id: 'log_' + memoryStore.generateId(),
        donation: donation._id,
        status: 'Cancelled',
        updatedBy: user,
        actorRole: user.role,
        title: 'Request Cancelled',
        note: note || 'Cancelled',
        timestamp: new Date(),
      });
      return request;
    }
  }

  const request = await DonationRequest.findById(requestId)
    .populate('donation')
    .populate('ngo', 'name organizationName')
    .populate('donor', 'name organizationName');

  if (!request) throw new Error('Request not found');

  const donation = await FoodDonation.findById(request.donation._id);

  if (status === 'Picked Up') {
    if (request.status !== 'Accepted') {
      throw new Error('Can only mark Picked Up after donation is Accepted');
    }
    if (otp && otp.trim() !== request.verificationOtp) {
      throw new Error('Invalid verification OTP provided');
    }

    request.status = 'Picked Up';
    request.pickedUpAt = new Date();
    await request.save();

    donation.status = 'Picked Up';
    await donation.save();

    await TrackingLog.create({
      donation: donation._id,
      status: 'Picked Up',
      updatedBy: user._id,
      actorRole: user.role,
      title: 'Food Picked Up',
      note: note || `Volunteer ${request.volunteerName} collected food. In transit.`,
    });

    return request;
  }

  if (status === 'Delivered') {
    if (request.status !== 'Picked Up') {
      throw new Error('Can only mark Delivered after food is Picked Up');
    }

    request.status = 'Delivered';
    request.deliveredAt = new Date();
    await request.save();

    donation.status = 'Delivered';
    await donation.save();

    await TrackingLog.create({
      donation: donation._id,
      status: 'Delivered',
      updatedBy: user._id,
      actorRole: user.role,
      title: 'Meals Successfully Delivered',
      note: note || `All ${donation.servings} meals reached beneficiaries safely via ${request.ngo.organizationName || request.ngo.name}.`,
    });

    return request;
  }

  if (status === 'Cancelled') {
    request.status = 'Cancelled';
    request.responseNote = note || 'Cancelled';
    await request.save();

    if (donation.acceptedRequest && donation.acceptedRequest.toString() === request._id.toString()) {
      donation.status = 'Available';
      donation.assignedNgo = null;
      donation.acceptedRequest = null;
      await donation.save();
    }

    await TrackingLog.create({
      donation: donation._id,
      status: 'Cancelled',
      updatedBy: user._id,
      actorRole: user.role,
      title: 'Request Cancelled',
      note: note || 'Cancelled',
    });

    return request;
  }
};

const getMyRequests = async (user) => {
  const userId = user._id || user.id;

  if (isMemory()) {
    const list = memoryStore.requests.filter((r) => {
      const ngoId = r.ngo?._id || r.ngo?.id || r.ngo;
      return ngoId === userId;
    });

    return list.map((r) => {
      const donId = r.donation?._id || r.donation?.id || r.donation;
      const don = memoryStore.donations.find((d) => d._id === donId || d.id === donId);
      return {
        ...r,
        donation: don || r.donation,
      };
    });
  }

  return await DonationRequest.find({ ngo: user._id })
    .populate({
      path: 'donation',
      populate: { path: 'donor', select: 'name organizationName phone email city address' },
    })
    .sort({ createdAt: -1 });
};

// Platform stats
const getPlatformStats = async () => {
  if (isMemory()) {
    const totalDonors = memoryStore.users.filter((u) => u.role === 'donor').length;
    const totalNgos = memoryStore.users.filter((u) => u.role === 'ngo').length;
    const totalDonations = memoryStore.donations.length;
    const availableDonations = memoryStore.donations.filter((d) => d.status === 'Available').length;
    const inProgressDonations = memoryStore.donations.filter((d) =>
      ['Requested', 'Accepted', 'Picked Up'].includes(d.status)
    ).length;
    const deliveredDonations = memoryStore.donations.filter((d) => d.status === 'Delivered').length;

    const estimatedMealsOffered = memoryStore.donations.reduce((sum, d) => sum + (Number(d.servings) || 0), 0);
    const verifiedMealsDelivered = memoryStore.donations
      .filter((d) => d.status === 'Delivered')
      .reduce((sum, d) => sum + (Number(d.servings) || 0), 0);

    const estimatedKgFoodSaved = Math.round(verifiedMealsDelivered * 0.4);
    const estimatedCo2SavedKg = Math.round(estimatedKgFoodSaved * 1.9);

    const catMap = {};
    memoryStore.donations.forEach((d) => {
      const cat = d.category || 'Other';
      if (!catMap[cat]) catMap[cat] = { count: 0, servings: 0 };
      catMap[cat].count += 1;
      catMap[cat].servings += Number(d.servings) || 0;
    });

    const categoryBreakdown = Object.keys(catMap).map((cat) => ({
      category: cat,
      donationsCount: catMap[cat].count,
      totalServings: catMap[cat].servings,
    }));

    return {
      verified: {
        totalDonations,
        availableDonations,
        inProgressDonations,
        deliveredDonations,
        verifiedMealsDelivered,
        participatingDonors: totalDonors,
        participatingNgos: totalNgos,
      },
      estimates: {
        estimatedMealsOffered,
        estimatedKgFoodSaved,
        estimatedCo2SavedKg,
      },
      categoryBreakdown,
    };
  }

  const totalDonors = await User.countDocuments({ role: 'donor' });
  const totalNgos = await User.countDocuments({ role: 'ngo' });
  const totalDonations = await FoodDonation.countDocuments();
  const availableDonations = await FoodDonation.countDocuments({ status: 'Available' });
  const inProgressDonations = await FoodDonation.countDocuments({
    status: { $in: ['Requested', 'Accepted', 'Picked Up'] },
  });
  const deliveredDonations = await FoodDonation.countDocuments({ status: 'Delivered' });

  const mealsOfferedAgg = await FoodDonation.aggregate([
    { $group: { _id: null, totalServings: { $sum: '$servings' } } },
  ]);
  const estimatedMealsOffered = mealsOfferedAgg[0]?.totalServings || 0;

  const mealsDeliveredAgg = await FoodDonation.aggregate([
    { $match: { status: 'Delivered' } },
    { $group: { _id: null, totalServings: { $sum: '$servings' } } },
  ]);
  const verifiedMealsDelivered = mealsDeliveredAgg[0]?.totalServings || 0;

  const estimatedKgFoodSaved = Math.round(verifiedMealsDelivered * 0.4);
  const estimatedCo2SavedKg = Math.round(estimatedKgFoodSaved * 1.9);

  const categoryStats = await FoodDonation.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 }, servings: { $sum: '$servings' } } },
    { $sort: { count: -1 } },
  ]);

  return {
    verified: {
      totalDonations,
      availableDonations,
      inProgressDonations,
      deliveredDonations,
      verifiedMealsDelivered,
      participatingDonors: totalDonors,
      participatingNgos: totalNgos,
    },
    estimates: {
      estimatedMealsOffered,
      estimatedKgFoodSaved,
      estimatedCo2SavedKg,
    },
    categoryBreakdown: categoryStats.map((c) => ({
      category: c._id || 'Other',
      donationsCount: c.count,
      totalServings: c.servings,
    })),
  };
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  getAllUsers,
  getDonations,
  getDonationById,
  createDonation,
  getMyDonations,
  updateDonation,
  cancelDonation,
  createRequest,
  respondToRequest,
  updateLifecycleStatus,
  getMyRequests,
  getPlatformStats,
};
