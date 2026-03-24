import Doctor from '../models/Doctor.js';
import User from '../models/User.js';

export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).populate('userId', 'name email phone');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email phone');
    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    
    doctor.specialization = req.body.specialization || doctor.specialization;
    doctor.experience = req.body.experience || doctor.experience;
    doctor.fees = req.body.fees || doctor.fees;
    doctor.bio = req.body.bio || doctor.bio;
    doctor.address = req.body.address || doctor.address;
    doctor.availability = req.body.availability || doctor.availability;

    const updatedDoctor = await doctor.save();
    res.json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
