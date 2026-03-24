import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import Payment from '../models/Payment.js';

export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await Doctor.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    
    const payments = await Payment.find({ status: 'success' });
    const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

    const recentAppointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('patientId', 'name email')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name' }
      });

    res.json({
      totalUsers,
      totalDoctors,
      totalAppointments,
      totalRevenue,
      recentAppointments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .populate('patientId', 'name email')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name' }
      });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const { name, email, password, phone, specialization, experience, fees, bio } = req.body;
    
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, password, phone, role: 'doctor' });
    } else {
      user.role = 'doctor';
      await user.save();
    }

    const doctorExists = await Doctor.findOne({ userId: user._id });
    if (doctorExists) {
      return res.status(400).json({ message: 'Doctor profile already exists for this user' });
    }

    const defaultAvailability = [
      { day: "Monday", slots: ["09:00", "10:00", "11:00", "13:00", "14:00"] },
      { day: "Wednesday", slots: ["09:00", "10:00", "11:00", "13:00", "14:00"] },
      { day: "Friday", slots: ["09:00", "10:00", "11:00", "13:00", "14:00"] }
    ];

    const doctorProfile = await Doctor.create({
      userId: user._id,
      specialization,
      experience,
      fees,
      bio,
      availability: defaultAvailability
    });

    res.status(201).json({ user, doctorProfile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    await User.findByIdAndDelete(doctor.userId);
    await doctor.deleteOne();

    res.json({ message: 'Doctor removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
