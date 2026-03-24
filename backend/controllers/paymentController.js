import Stripe from 'stripe';
import Appointment from '../models/Appointment.js';
import Payment from '../models/Payment.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

export const createCheckoutSession = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await Appointment.findById(appointmentId).populate('doctorId');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (process.env.STRIPE_SECRET_KEY === 'sk_test_mock' || !process.env.STRIPE_SECRET_KEY) {
      // Mock Bypass for local testing without real Stripe keys
      await Payment.create({ appointmentId, stripeSessionId: 'mock_' + Date.now(), amount: appointment.fees, status: 'success' });
      await Appointment.findByIdAndUpdate(appointmentId, { paymentStatus: 'paid', status: 'confirmed' });
      return res.json({ id: 'mock_session', url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/my-appointments` });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'MediSync Medical Appointment' },
          unit_amount: appointment.fees * 100, // cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/my-appointments?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/my-appointments?cancel=true`,
      metadata: { appointmentId: appointment._id.toString() }
    });

    await Payment.create({
      appointmentId,
      stripeSessionId: session.id,
      amount: appointment.fees,
      status: 'pending'
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock');
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const appointmentId = session.metadata.appointmentId;
    
    await Payment.findOneAndUpdate({ stripeSessionId: session.id }, { status: 'success' });
    await Appointment.findByIdAndUpdate(appointmentId, { paymentStatus: 'paid' });
  }

  res.json({ received: true });
};
