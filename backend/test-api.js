import axios from 'axios';

const API_URL = 'http://127.0.0.1:5001/api';

async function testApi() {
  try {
    console.log('--- STARTING E2E API TESTS ---');

    console.log('\n[1] Testing Patient Login...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'alex@example.com',
      password: 'password123'
    });
    const patientToken = loginRes.data.token;
    console.log('✅ Patient Login Successful. Token received.');

    console.log('\n[2] Testing Get Doctors...');
    const doctorsRes = await axios.get(`${API_URL}/doctors`);
    console.log(`✅ Loaded ${doctorsRes.data.length} doctors successfully`);
    const doctorId = doctorsRes.data[0]._id;

    console.log('\n[3] Testing Book Appointment...');
    const bookRes = await axios.post(`${API_URL}/appointments/book`, {
      doctorId,
      date: '2026-03-25',
      time: '10:00'
    }, { headers: { Authorization: `Bearer ${patientToken}` } });
    console.log('✅ Appointment Booked successfully! ID:', bookRes.data._id);

    console.log('\n[4] Testing Checkout Stripe Generation...');
    const checkoutRes = await axios.post(`${API_URL}/payments/create-checkout-session`, {
      appointmentId: bookRes.data._id
    }, { headers: { Authorization: `Bearer ${patientToken}` } });
    console.log('✅ Stripe Checkout Session Generated successfully! URL:', checkoutRes.data.url.substring(0, 50) + '...');

    console.log('\n[5] Testing Admin Login...');
    const adminRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@medisync.com',
      password: 'password123'
    });
    const adminToken = adminRes.data.token;
    console.log('✅ Admin Login Successful');

    console.log('\n[6] Testing Admin Analytics Dashboard...');
    const analyticsRes = await axios.get(`${API_URL}/admin/analytics`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Admin Analytics Loaded successfully. Total Appointments:', analyticsRes.data.totalAppointments);

    console.log('\n🎉 --- ALL API TESTS PASSED BEAUTIFULLY! --- 🎉');
  } catch (error) {
    console.error('\n❌ API TEST FAILED:', error.response?.data?.message || error.message);
  }
}

testApi();
