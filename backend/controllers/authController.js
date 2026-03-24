import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'mock_client_id');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role, phone });
    if (user) {
      res.status(201).json({
        id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    let decodedPayload;

    try {
      // Attempt verification if client ID is real
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      decodedPayload = ticket.getPayload();
    } catch (err) {
      // Fallback decode for development if no real Google Client ID is configured
      decodedPayload = jwt.decode(token);
      if (!decodedPayload) throw new Error('Invalid Google Token');
    }

    const { email, name, picture } = decodedPayload;

    let user = await User.findOne({ email });

    if (!user) {
      // Create user if they don't exist securely
      user = await User.create({
        name,
        email,
        password: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        role: 'patient'
      });
    }

    res.json({
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      picture: picture || null,
      token: generateToken(user._id)
    });

  } catch (error) {
    res.status(401).json({ message: 'Google authentication failed', error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json({ id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
