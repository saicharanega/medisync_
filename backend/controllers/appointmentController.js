import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;
    
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const existingAppt = await Appointment.findOne({ doctorId, date, time, status: { $ne: 'cancelled' } });
    if (existingAppt) return res.status(400).json({ message: 'Time slot is not available' });

    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      date,
      time,
      fees: doctor.fees,
      status: 'pending'
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    let appointments;
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id });
      if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
      appointments = await Appointment.find({ doctorId: doctor._id }).populate('patientId', 'name email');
    } else if (req.user.role === 'admin') {
      appointments = await Appointment.find({}).populate('patientId', 'name email').populate('doctorId');
    } else {
      appointments = await Appointment.find({ patientId: req.user.id }).populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name' }
      });
    }
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    
    // RBAC & Ownership Validation Layer
    if (req.user.role === 'patient') {
      if (appointment.patientId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to modify this appointment' });
      }
      if (status !== 'cancelled') {
        return res.status(403).json({ message: 'Patients can only cancel appointments' });
      }
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id });
      if (!doctor || appointment.doctorId.toString() !== doctor._id.toString()) {
        return res.status(403).json({ message: 'Not authorized for this appointment' });
      }
    }
    
    appointment.status = status;
    const updated = await appointment.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
