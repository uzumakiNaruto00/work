const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Car = require('./models/Car');
const ParkingSlot = require('./models/ParkingSlot');
const ParkingRecord = require('./models/ParkingRecord');
const Payment = require('./models/Payment');
const User = require('./models/user');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-parking';

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // Clear collections
  await Promise.all([
    Car.deleteMany({}),
    ParkingSlot.deleteMany({}),
    ParkingRecord.deleteMany({}),
    Payment.deleteMany({}),
    User.deleteMany({})
  ]);

  // Seed Cars
  const cars = await Car.insertMany([
    { plateNumber: 'RAB123A', ownerName: 'Alice', contactInfo: '0788000001' },
    { plateNumber: 'RAC456B', ownerName: 'Bob', contactInfo: '0788000002' },
    { plateNumber: 'RAD789C', ownerName: 'Charlie', contactInfo: '0788000003' }
  ]);

  // Seed ParkingSlots
  const slots = await ParkingSlot.insertMany([
    { slotNumber: 'A1', location: 'Level 1', status: 'Available' },
    { slotNumber: 'A2', location: 'Level 1', status: 'Available' },
    { slotNumber: 'B1', location: 'Level 2', status: 'Available' }
  ]);

  // Seed ParkingRecords
  const now = new Date();
  const earlier = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago
  const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000); // 1 hour ago

  const parkingRecords = await ParkingRecord.insertMany([
    {
      plateNumber: cars[0]._id,
      slotNumber: slots[0].slotNumber,
      entryTime: earlier,
      exitTime: now,
      duration: 2,
      amountPaid: 1000,
      isPaid: true
    },
    {
      plateNumber: cars[1]._id,
      slotNumber: slots[1].slotNumber,
      entryTime: oneHourAgo,
      exitTime: now,
      duration: 1,
      amountPaid: 500,
      isPaid: true
    },
    {
      plateNumber: cars[2]._id,
      slotNumber: slots[2].slotNumber,
      entryTime: now,
      // Still parked, no exitTime, unpaid
      isPaid: false
    }
  ]);

  // Seed Payments (for completed records)
  const payments = await Payment.insertMany([
    {
      recordId: parkingRecords[0]._id,
      amountPaid: parkingRecords[0].amountPaid,
      paymentMethod: 'Cash'
    },
    {
      recordId: parkingRecords[1]._id,
      amountPaid: parkingRecords[1].amountPaid,
      paymentMethod: 'Card'
    }
  ]);

  // Seed Users (admin and staff)
  const adminPassword = await bcrypt.hash('admin123', 10);
  const staffPassword = await bcrypt.hash('staff123', 10);

  await User.insertMany([
    { username: 'admin', password: adminPassword, role: 'admin' },
    { username: 'staff', password: staffPassword, role: 'staff' }
  ]);

  // --- Sample Report Generation (not a collection, just for demonstration) ---
  // This is how you would generate a daily report after seeding:
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const dailyReport = await ParkingRecord.find({
    entryTime: { $gte: today, $lt: tomorrow }
  }).lean();

  console.log('\nSample Daily Report for Today:');
  dailyReport.forEach(record => {
    console.log({
      plateNumber: record.plateNumber,
      slotNumber: record.slotNumber,
      entryTime: record.entryTime,
      exitTime: record.exitTime,
      duration: record.duration,
      amountPaid: record.amountPaid,
      isPaid: record.isPaid
    });
  });

  console.log('\n✅ Database seeded successfully!');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('❌ Seeding error:', err);
  mongoose.disconnect();
});