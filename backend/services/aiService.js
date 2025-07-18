const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  // Generate a personalized meal plan
  async generateMealPlan(userProfile) {
    const {
      age, weight, height, gender, activityLevel, fitnessGoal, 
      dietaryPreference, allergies, dailyCalorieTarget
    } = userProfile;

    const prompt = `
    Create a detailed daily meal plan for a person with the following profile:
    - Age: ${age} years
    - Weight: ${weight} kg
    - Height: ${height} cm
    - Gender: ${gender}
    - Activity Level: ${activityLevel}
    - Fitness Goal: ${fitnessGoal}
    - Dietary Preference: ${dietaryPreference}
    - Allergies: ${allergies?.join(', ') || 'None'}
    - Daily Calorie Target: ${dailyCalorieTarget} calories

    Please provide a JSON response with the following structure:
    {
      "meals": [
        {
          "name": "Breakfast Name",
          "type": "breakfast",
          "ingredients": [{"name": "ingredient", "quantity": "amount", "unit": "g/ml/cups"}],
          "instructions": "cooking instructions",
          "prep_time": 15,
          "cook_time": 10,
          "servings": 1,
          "nutrition": {
            "calories": 400,
            "protein": 25,
            "carbs": 45,
            "fat": 15,
            "fiber": 8,
            "sugar": 10,
            "sodium": 500
          },
          "dietary_tags": ["keto", "vegetarian"],
          "difficulty": "easy"
        }
      ],
      "total_nutrition": {
        "calories": 2000,
        "protein": 150,
        "carbs": 200,
        "fat": 75,
        "fiber": 35,
        "sugar": 50,
        "sodium": 2000
      },
      "hydration_goal": 2500,
      "daily_tips": ["tip1", "tip2"],
      "meal_timing": {
        "breakfast": "7:00 AM",
        "lunch": "12:00 PM",
        "snack": "3:00 PM",
        "dinner": "7:00 PM"
      }
    }

    Focus on:
    - Balanced nutrition that supports the fitness goal
    - Appropriate portion sizes for the calorie target
    - ${dietaryPreference} dietary preferences
    - Avoiding ${allergies?.join(', ') || 'no specific'} allergies
    - Easy-to-prepare, nutritious meals
    - Proper meal timing for optimal metabolism
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Clean up the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse meal plan JSON response');
    } catch (error) {
      console.error('Error generating meal plan:', error);
      throw new Error('Failed to generate meal plan');
    }
  }

  // Generate a personalized workout plan
  async generateWorkoutPlan(userProfile) {
    const {
      age, weight, height, gender, activityLevel, fitnessGoal, 
      fitnessLevel, workoutDaysPerWeek, workoutDuration, availableEquipment
    } = userProfile;

    const prompt = `
    Create a detailed workout plan for a person with the following profile:
    - Age: ${age} years
    - Weight: ${weight} kg
    - Height: ${height} cm
    - Gender: ${gender}
    - Activity Level: ${activityLevel}
    - Fitness Goal: ${fitnessGoal}
    - Fitness Level: ${fitnessLevel}
    - Workout Days Per Week: ${workoutDaysPerWeek}
    - Preferred Workout Duration: ${workoutDuration} minutes
    - Available Equipment: ${availableEquipment?.join(', ') || 'None'}

    Please provide a JSON response with the following structure:
    {
      "name": "Custom Workout Plan",
      "type": "mixed",
      "duration": 45,
      "warm_up": [
        {
          "name": "Exercise Name",
          "type": "cardio",
          "duration": 5,
          "instructions": "detailed instructions",
          "difficulty": "beginner"
        }
      ],
      "exercises": [
        {
          "name": "Exercise Name",
          "type": "strength",
          "muscle_groups": ["chest", "triceps"],
          "equipment": ["dumbbells"],
          "sets": 3,
          "reps": "12-15",
          "rest_time": 60,
          "instructions": "detailed form instructions",
          "difficulty": "intermediate",
          "calories_burned_per_minute": 8
        }
      ],
      "cool_down": [
        {
          "name": "Stretching Exercise",
          "type": "flexibility",
          "duration": 5,
          "instructions": "stretching instructions",
          "difficulty": "beginner"
        }
      ],
      "target_muscle_groups": ["full_body"],
      "estimated_calories": 350,
      "safety_tips": ["tip1", "tip2"],
      "progression_notes": "How to progress this workout",
      "alternative_exercises": [
        {
          "original": "Push-ups",
          "alternative": "Wall Push-ups",
          "reason": "For beginners or those with wrist issues"
        }
      ]
    }

    Focus on:
    - Exercises appropriate for ${fitnessLevel} level
    - Supporting ${fitnessGoal} goals
    - Using available equipment: ${availableEquipment?.join(', ') || 'bodyweight exercises'}
    - Proper warm-up and cool-down
    - Progressive difficulty
    - Safe form and technique
    - Variety to prevent boredom
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Clean up the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse workout plan JSON response');
    } catch (error) {
      console.error('Error generating workout plan:', error);
      throw new Error('Failed to generate workout plan');
    }
  }

  // Generate holistic health plan combining meal and workout
  async generateHolisticHealthPlan(userProfile, mealPlan, workoutPlan) {
    const { name, fitnessGoal, age } = userProfile;

    const prompt = `
    Create a comprehensive health strategy message for ${name}, a ${age}-year-old with the goal of ${fitnessGoal}.
    
    Meal Plan Summary:
    - Total Daily Calories: ${mealPlan.total_nutrition?.calories || 'N/A'}
    - Protein: ${mealPlan.total_nutrition?.protein || 'N/A'}g
    - Dietary Preference: ${userProfile.dietaryPreference}
    
    Workout Plan Summary:
    - Duration: ${workoutPlan.duration || 'N/A'} minutes
    - Type: ${workoutPlan.type || 'Mixed'}
    - Estimated Calories Burned: ${workoutPlan.estimated_calories || 'N/A'}
    
    Provide a motivational and informative response that includes:
    1. Personalized greeting
    2. How the meal and workout plans work together
    3. Key success tips for achieving their ${fitnessGoal} goal
    4. Timeline expectations
    5. Motivation and encouragement
    6. Important reminders about consistency and patience
    
    Keep it encouraging, personalized, and under 300 words.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating holistic plan:', error);
      return `Hello ${name}! Your personalized health plan has been created to help you achieve your ${fitnessGoal} goal. Remember, consistency is key to success!`;
    }
  }

  // Generate lifestyle tips based on user profile
  async generateLifestyleTips(userProfile) {
    const { fitnessGoal, activityLevel, age } = userProfile;

    const prompt = `
    Generate 5 personalized lifestyle tips for someone with:
    - Fitness Goal: ${fitnessGoal}
    - Activity Level: ${activityLevel}
    - Age: ${age}
    
    Provide practical, actionable tips that complement their fitness and nutrition plan.
    Return as an array of strings in JSON format: ["tip1", "tip2", "tip3", "tip4", "tip5"]
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return [
        "Stay hydrated throughout the day",
        "Get 7-9 hours of quality sleep",
        "Take rest days seriously for recovery",
        "Track your progress regularly",
        "Listen to your body and adjust intensity"
      ];
    } catch (error) {
      console.error('Error generating lifestyle tips:', error);
      return [
        "Stay consistent with your routine",
        "Focus on gradual progress",
        "Prioritize recovery and rest"
      ];
    }
  }

  // Search for additional health information using web search simulation
  async searchHealthInfo(query) {
    try {
      // Simulate web search with Gemini
      const prompt = `
      Provide current, evidence-based information about: "${query}"
      
      Focus on:
      - Scientific accuracy
      - Practical applications
      - Safety considerations
      - Recent developments
      
      Keep the response concise and informative (under 200 words).
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error searching health info:', error);
      return 'Unable to retrieve additional information at this time.';
    }
  }

  // Generate chatbot response
  async generateChatbotResponse(message, userContext = {}) {
    const prompt = `
    You are FitGenie, an AI health and fitness assistant. Respond to the user's message professionally and helpfully.
    
    User Context:
    - Fitness Goal: ${userContext.fitnessGoal || 'Not specified'}
    - Fitness Level: ${userContext.fitnessLevel || 'Not specified'}
    - Dietary Preference: ${userContext.dietaryPreference || 'Not specified'}
    
    User Message: "${message}"
    
    Guidelines:
    - Be supportive and encouraging
    - Provide practical, actionable advice
    - If it's a medical question, recommend consulting healthcare providers
    - Keep responses concise but informative
    - Stay focused on fitness, nutrition, and wellness topics
    - If asked about medications or serious health issues, always recommend professional medical consultation
    
    Response:
    `;

    try {
      // Check if API key is configured
      if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'YOUR_ACTUAL_GEMINI_API_KEY_HERE') {
        return "I'm currently not configured properly. Please check the API key configuration.";
      }

      // Try Google Gemini first
      if (process.env.GOOGLE_API_KEY.startsWith('AIza')) {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } 
      // If it's an OpenRouter key, use OpenRouter API
      else if (process.env.GOOGLE_API_KEY.startsWith('sk-or-')) {
        return await this.generateOpenRouterResponse(prompt);
      }
      // If API is not working, provide a helpful fallback response
      else {
        return this.generateFallbackResponse(message, userContext);
      }
    } catch (error) {
      console.error('Error generating chatbot response:', error);
      return this.generateFallbackResponse(message, userContext);
    }
  }

  // Fallback response generator for when AI services are unavailable
  generateFallbackResponse(message, userContext) {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
    const motivation = ['motivat', 'inspire', 'encourage'];
    const workout = ['workout', 'exercise', 'training', 'fitness'];
    const diet = ['diet', 'nutrition', 'food', 'meal', 'eat'];
    
    const lowerMessage = message.toLowerCase();
    
    if (greetings.some(word => lowerMessage.includes(word))) {
      return `Hello! 👋 I'm FitGenie, your AI fitness assistant. I'm here to help you with workouts, nutrition advice, and motivation to reach your fitness goals. How can I support your wellness journey today?`;
    }
    
    if (motivation.some(word => lowerMessage.includes(word))) {
      return `🌟 Remember, every small step counts! Whether it's choosing the stairs over the elevator or drinking an extra glass of water, you're making progress. Your fitness journey is unique to you, and consistency beats perfection every time. Keep going - you've got this! 💪`;
    }
    
    if (workout.some(word => lowerMessage.includes(word))) {
      return `🏋️‍♂️ Here's a quick tip: Start with bodyweight exercises like push-ups, squats, and planks. Aim for 15-20 minutes of activity daily. Remember to warm up before and cool down after your workout. Listen to your body and gradually increase intensity as you get stronger!`;
    }
    
    if (diet.some(word => lowerMessage.includes(word))) {
      return `🥗 Focus on whole foods: lean proteins, colorful vegetables, fruits, whole grains, and healthy fats. Stay hydrated with plenty of water throughout the day. A balanced plate typically includes 1/2 vegetables, 1/4 protein, and 1/4 complex carbs. Small, consistent changes lead to lasting results!`;
    }
    
    return `Thanks for your question! While I'm experiencing some technical difficulties connecting to my AI service right now, I'm still here to help with general fitness and wellness guidance. For specific health concerns, please consult with a healthcare professional. Is there a particular aspect of fitness or nutrition you'd like to know more about?`;
  }

  // OpenRouter API fallback method
  async generateOpenRouterResponse(prompt) {
    try {
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'openai/gpt-3.5-turbo', // Use a more common model
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.GOOGLE_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5000',
          'X-Title': 'FitGenie Health Assistant'
        }
      });

      return response.data.choices[0]?.message?.content || "I couldn't generate a proper response.";
    } catch (error) {
      console.error('OpenRouter API error:', error.response?.data || error.message);
      return "I'm having trouble connecting to the AI service. Please try again later.";
    }
  }
}

module.exports = new AIService();
