const aiService = require('./services/aiService');

async function testAI() {
  try {
    console.log('Testing AI service...\n');
    
    // Test breakfast question
    console.log('=== Testing Breakfast Question ===');
    const breakfastResponse = await aiService.generateChatbotResponse("What should I eat for breakfast?");
    console.log('Response:', breakfastResponse);
    
    console.log('\n=== Testing Workout Question ===');
    const workoutResponse = await aiService.generateChatbotResponse("Suggest a quick workout");
    console.log('Response:', workoutResponse);
    
    console.log('\n=== Testing Greeting ===');
    const greetingResponse = await aiService.generateChatbotResponse("Hello");
    console.log('Response:', greetingResponse);
    
    console.log('\n=== Testing Motivation ===');
    const motivationResponse = await aiService.generateChatbotResponse("I need some motivation");
    console.log('Response:', motivationResponse);
    
  } catch (error) {
    console.error('AI Test Error:', error.message);
  }
}

testAI();
