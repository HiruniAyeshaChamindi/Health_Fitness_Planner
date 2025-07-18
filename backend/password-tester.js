const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const User = require('./models/User');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function testPassword() {
  try {
    console.log('🔍 Password Tester for FitGenie Login');
    console.log('=====================================');
    
    // Get the user
    const user = await User.findOne({ email: 'sandali.22@cse.mrt.ac.lk' });
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }
    
    console.log(`✅ Found user: ${user.email}`);
    console.log('\nNow let\'s test passwords...\n');
    
    function askPassword() {
      rl.question('Enter password to test (or "quit" to exit): ', async (password) => {
        if (password.toLowerCase() === 'quit') {
          console.log('Goodbye! 👋');
          rl.close();
          mongoose.connection.close();
          return;
        }
        
        try {
          const isMatch = await user.comparePassword(password);
          if (isMatch) {
            console.log('🎉 ✅ PASSWORD CORRECT! This is your login password.');
            console.log(`Your login credentials are:`);
            console.log(`Email: ${user.email}`);
            console.log(`Password: ${password}`);
            rl.close();
            mongoose.connection.close();
          } else {
            console.log('❌ Wrong password. Try again...\n');
            askPassword();
          }
        } catch (error) {
          console.log('Error testing password:', error.message);
          askPassword();
        }
      });
    }
    
    // Test some common passwords first
    const commonPasswords = [
      'sandali123', 'sandali', 'Sandali123', 'SANDALI123',
      'password', 'Password123', 'password123', 'PASSWORD123',
      '123456', '12345678', 'admin', 'test', 'fitgenie',
      'qwerty', 'abc123', 'Password', 'password1'
    ];
    
    console.log('Testing common passwords first...');
    for (const testPass of commonPasswords) {
      const isMatch = await user.comparePassword(testPass);
      if (isMatch) {
        console.log(`🎉 ✅ FOUND IT! Your password is: "${testPass}"`);
        console.log(`Your login credentials are:`);
        console.log(`Email: ${user.email}`);
        console.log(`Password: ${testPass}`);
        rl.close();
        mongoose.connection.close();
        return;
      }
    }
    
    console.log('❌ None of the common passwords worked.');
    console.log('Let\'s try manual testing...\n');
    askPassword();
    
  } catch (error) {
    console.error('Error:', error);
    rl.close();
    mongoose.connection.close();
  }
}

testPassword();
