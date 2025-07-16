const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const User = require('./models/User');

// Test login endpoint
app.post('/test-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('\n=== LOGIN TEST ===');
    console.log('Email:', email);
    console.log('Password length:', password.length);
    console.log('Password preview:', password.substring(0, 3) + '***');
    
    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.log('❌ User not found');
      return res.json({ success: false, message: 'User not found' });
    }
    
    console.log('✅ User found:', user.email);
    console.log('Stored password hash:', user.password.substring(0, 10) + '...');
    
    // Test password
    console.log('Testing password...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);
    
    if (isMatch) {
      console.log('🎉 LOGIN SUCCESSFUL!');
      res.json({ success: true, message: 'Login successful!' });
    } else {
      console.log('❌ Password does not match');
      res.json({ success: false, message: 'Password does not match' });
    }
    
  } catch (error) {
    console.error('Error:', error);
    res.json({ success: false, message: 'Server error', error: error.message });
  }
});

app.listen(5001, () => {
  console.log('🧪 Test server running on http://localhost:5001');
  console.log('You can test login by sending POST to http://localhost:5001/test-login');
  console.log('with { "email": "your-email", "password": "your-password" }');
});
