export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  experience: number;
  fees: number;
  avatar: string;
  bio: string;
  rating: number;
  totalReviews: number;
  available: boolean;
  availability: DaySlot[];
  address: string;
  education: string;
}

export interface DaySlot {
  day: string;
  slots: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  fees: number;
  paymentStatus: 'paid' | 'pending' | 'refunded';
}

export interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  date: string;
  method: string;
}
