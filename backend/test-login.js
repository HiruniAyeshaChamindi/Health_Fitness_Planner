const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./models/User');

async function testLogin() {
  try {
    console.log('Connected to MongoDB');
    
    // Get all users to see what's in the database
    const users = await User.find({}).select('email name createdAt');
    console.log('\n=== Users in database ===');
    users.forEach(user => {
      console.log(`Email: ${user.email}, Name: ${user.name}, Created: ${user.createdAt}`);
    });
    
    if (users.length === 0) {
      console.log('\nNo users found in database. Please register first.');
      process.exit(0);
    }
    
    // Test login with the first user
    const testUser = users[0];
    console.log(`\n=== Testing login for: ${testUser.email} ===`);
    
    // Get the full user with password
    const fullUser = await User.findOne({ email: testUser.email });
    console.log('User found in database:', !!fullUser);
    console.log('Password hash length:', fullUser.password.length);
    console.log('Password starts with $2a$ (bcrypt):', fullUser.password.startsWith('$2a$'));
    
    // Test password comparison with common passwords
    const testPasswords = ['password123', '123456', 'password', 'admin', 'test123'];
    
    for (const testPassword of testPasswords) {
      try {
        const isMatch = await fullUser.comparePassword(testPassword);
        console.log(`Password "${testPassword}": ${isMatch ? 'MATCH' : 'no match'}`);
        if (isMatch) {
          console.log(`\n✅ FOUND WORKING PASSWORD: "${testPassword}"`);
          break;
        }
      } catch (error) {
        console.log(`Error testing password "${testPassword}":`, error.message);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

testLogin();
