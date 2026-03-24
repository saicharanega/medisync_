import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Doctor from './models/Doctor.js';
import Appointment from './models/Appointment.js';
import Payment from './models/Payment.js';
import { doctors } from '../frontend/src/data/doctors.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/medisync';
mongoose.connect(MONGO_URI);

const seedData = async () => {
  try {
    await User.deleteMany();
    await Doctor.deleteMany();
    await Appointment.deleteMany();
    await Payment.deleteMany();

    console.log('Cleared existing data.');

    // Create Admin and Patient
    await User.create({ name: 'Admin', email: 'admin@medisync.com', password: '123456', role: 'admin' });
    const patient = await User.create({ name: 'Bulli Raju', email: 'bulliraju@medisync.com', password: 'password123', role: 'patient' });

    // Seed Doctors
    for (let doc of doctors) {
      const user = await User.create({
        name: doc.name,
        email: doc.email,
        password: 'password123',
        role: 'doctor'
      });
      await Doctor.create({
        userId: user._id,
        specialization: doc.specialization,
        experience: doc.experience,
        fees: doc.fees,
        bio: doc.bio,
        rating: doc.rating,
        totalReviews: doc.totalReviews,
        address: doc.address,
        education: doc.education,
        availability: doc.availability
      });
    }

    console.log('Database seeded successfully with default users and doctors!');
    process.exit();
  } catch (error) {
    console.error('Data seeding failed:', error);
    process.exit(1);
  }
};

seedData();
