const axios = require('axios');

async function testLoginAPI() {
  try {
    console.log('🧪 Testing Login API directly...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'sandali.22@cse.mrt.ac.lk',
      password: 'san123'
    });
    
    console.log('✅ Login API Success!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('❌ Login API Failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Network Error:', error.message);
    }
  }
}

testLoginAPI();
