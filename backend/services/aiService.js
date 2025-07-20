const axios = require('axios');

/**
 * AI Service for Health & Fitness Assistant
 * Supports both OpenAI API and intelligent dynamic responses
 */
class AIService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.openaiBaseUrl = 'https://api.openai.com/v1';
    
    if (!this.openaiApiKey) {
      console.warn('OpenAI API key not found. Using dynamic fallback mode.');
    }
    
    // Initialize dynamic response generators
    this.initializeDynamicGenerators();
  }

  /**
   * Initialize dynamic response generators and knowledge base
   */
  initializeDynamicGenerators() {
    // Nutritional databases
    this.nutritionDatabase = {
      macronutrients: {
        protein: { calories_per_gram: 4, sources: ['chicken', 'fish', 'eggs', 'beans', 'tofu', 'Greek yogurt'] },
        carbohydrates: { calories_per_gram: 4, sources: ['oats', 'quinoa', 'brown rice', 'sweet potato', 'fruits'] },
        fats: { calories_per_gram: 9, sources: ['avocado', 'nuts', 'olive oil', 'salmon', 'seeds'] }
      },
      meal_types: {
        breakfast: { timing: '7:00-9:00 AM', focus: 'energy_kickstart' },
        lunch: { timing: '12:00-2:00 PM', focus: 'sustained_energy' },
        dinner: { timing: '6:00-8:00 PM', focus: 'recovery_nutrients' },
        snack: { timing: '3:00-4:00 PM', focus: 'energy_maintenance' }
      }
    };

    // Exercise databases
    this.exerciseDatabase = {
      cardio: {
        beginner: ['walking', 'light jogging', 'stationary bike', 'swimming'],
        intermediate: ['running', 'cycling', 'rowing', 'HIIT'],
        advanced: ['sprint intervals', 'advanced HIIT', 'competitive sports']
      },
      strength: {
        bodyweight: ['push-ups', 'squats', 'lunges', 'planks', 'burpees'],
        equipment: ['dumbbell exercises', 'barbell training', 'resistance bands', 'kettlebell workouts']
      },
      flexibility: ['yoga', 'stretching', 'pilates', 'mobility work']
    };

    // Goal-specific parameters
    this.fitnessGoals = {
      weight_loss: { 
        calorie_deficit: 500, 
        cardio_focus: 60, 
        strength_focus: 40,
        protein_multiplier: 1.2 
      },
      muscle_gain: { 
        calorie_surplus: 300, 
        cardio_focus: 20, 
        strength_focus: 80,
        protein_multiplier: 1.6 
      },
      maintenance: { 
        calorie_balance: 0, 
        cardio_focus: 40, 
        strength_focus: 60,
        protein_multiplier: 1.0 
      }
    };

    // Activity level multipliers
    this.activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9
    };
  }

  /**
   * Make API call to OpenAI or return fallback response
   */
  async callOpenAI(prompt, options = {}) {
    // If no API key is available, return a fallback response
    if (!this.openaiApiKey) {
      return this.getFallbackResponse(prompt, options);
    }

    const {
      model = 'gpt-3.5-turbo',
      temperature = 0.7,
      max_tokens = 2000,
      response_format = null
    } = options;

    try {
      const response = await axios.post(
        `${this.openaiBaseUrl}/chat/completions`,
        {
          model,
          messages: [
            {
              role: 'system',
              content: 'You are FitGenie, an AI health and fitness assistant. Provide helpful, accurate, and personalized advice.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature,
          max_tokens,
          ...(response_format && { response_format })
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI API Error:', error.response?.data || error.message);
      // Return fallback response on API error
      return this.getFallbackResponse(prompt, options);
    }
  }

  /**
   * Calculate dynamic nutritional requirements
   */
  calculateNutritionalNeeds(userProfile) {
    const { age, weight, height, gender, activityLevel, fitnessGoal } = userProfile;
    
    // Calculate BMR using Mifflin-St Jeor equation
    let bmr;
    if (gender.toLowerCase() === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    // Apply activity multiplier
    const activityMultiplier = this.activityMultipliers[activityLevel] || 1.375;
    let tdee = bmr * activityMultiplier;
    
    // Adjust for fitness goal
    const goalParams = this.fitnessGoals[fitnessGoal] || this.fitnessGoals.maintenance;
    const targetCalories = tdee + goalParams.calorie_deficit || goalParams.calorie_surplus || 0;
    
    // Calculate macronutrient distribution
    const proteinGrams = Math.round(weight * goalParams.protein_multiplier);
    const proteinCalories = proteinGrams * 4;
    const fatCalories = Math.round(targetCalories * 0.25);
    const fatGrams = Math.round(fatCalories / 9);
    const carbCalories = targetCalories - proteinCalories - fatCalories;
    const carbGrams = Math.round(carbCalories / 4);
    
    return {
      calories: Math.round(targetCalories),
      protein: proteinGrams,
      carbs: carbGrams,
      fat: fatGrams,
      fiber: Math.round(age < 50 ? (gender.toLowerCase() === 'male' ? 38 : 25) : (gender.toLowerCase() === 'male' ? 30 : 21)),
      water: Math.round(weight * 35) // ml per kg body weight
    };
  }

  /**
   * Generate dynamic meal suggestions based on user profile
   */
  generateDynamicMealSuggestions(userProfile, mealType = 'breakfast') {
    const nutritionNeeds = this.calculateNutritionalNeeds(userProfile);
    const { dietaryPreference, allergies = [] } = userProfile;
    
    // Filter food sources based on dietary preferences and allergies
    const availableProteins = this.nutritionDatabase.macronutrients.protein.sources
      .filter(source => this.isAllowedFood(source, dietaryPreference, allergies));
    const availableCarbs = this.nutritionDatabase.macronutrients.carbohydrates.sources
      .filter(source => this.isAllowedFood(source, dietaryPreference, allergies));
    const availableFats = this.nutritionDatabase.macronutrients.fats.sources
      .filter(source => this.isAllowedFood(source, dietaryPreference, allergies));
    
    // Generate meal based on type and nutritional needs
    const mealCalories = Math.round(nutritionNeeds.calories * this.getMealCalorieRatio(mealType));
    const mealProtein = Math.round(nutritionNeeds.protein * this.getMealProteinRatio(mealType));
    
    return {
      type: mealType,
      target_calories: mealCalories,
      target_protein: mealProtein,
      suggested_proteins: availableProteins.slice(0, 3),
      suggested_carbs: availableCarbs.slice(0, 3),
      suggested_fats: availableFats.slice(0, 2),
      timing: this.nutritionDatabase.meal_types[mealType]?.timing || 'Flexible',
      focus: this.nutritionDatabase.meal_types[mealType]?.focus || 'balanced_nutrition'
    };
  }

  /**
   * Generate dynamic workout recommendations
   */
  generateDynamicWorkoutRecommendations(userProfile) {
    const { fitnessLevel, fitnessGoal, workoutDuration = 30, availableEquipment = [] } = userProfile;
    const goalParams = this.fitnessGoals[fitnessGoal] || this.fitnessGoals.maintenance;
    
    // Determine workout composition
    const cardioMinutes = Math.round(workoutDuration * (goalParams.cardio_focus / 100));
    const strengthMinutes = workoutDuration - cardioMinutes;
    
    // Select appropriate exercises
    const cardioExercises = this.exerciseDatabase.cardio[fitnessLevel] || this.exerciseDatabase.cardio.beginner;
    const strengthExercises = availableEquipment.length > 0 
      ? this.exerciseDatabase.strength.equipment 
      : this.exerciseDatabase.strength.bodyweight;
    
    return {
      duration: workoutDuration,
      cardio_focus: goalParams.cardio_focus,
      strength_focus: goalParams.strength_focus,
      recommended_cardio: cardioExercises.slice(0, 2),
      recommended_strength: strengthExercises.slice(0, 4),
      cardio_duration: cardioMinutes,
      strength_duration: strengthMinutes,
      difficulty: fitnessLevel,
      equipment_needed: availableEquipment.length > 0 ? availableEquipment : ['None - bodyweight only']
    };
  }

  /**
   * Helper method to check if food is allowed based on dietary preferences and allergies
   */
  isAllowedFood(food, dietaryPreference, allergies) {
    const lowerFood = food.toLowerCase();
    const lowerAllergies = allergies.map(a => a.toLowerCase());
    
    // Check allergies first
    if (lowerAllergies.some(allergy => lowerFood.includes(allergy))) {
      return false;
    }
    
    // Check dietary preferences
    if (dietaryPreference === 'vegetarian' && ['chicken', 'fish', 'salmon'].includes(lowerFood)) {
      return false;
    }
    if (dietaryPreference === 'vegan' && ['chicken', 'fish', 'eggs', 'greek yogurt', 'salmon'].includes(lowerFood)) {
      return false;
    }
    
    return true;
  }

  /**
   * Get meal calorie ratio based on meal type
   */
  getMealCalorieRatio(mealType) {
    const ratios = {
      breakfast: 0.25,
      lunch: 0.35,
      dinner: 0.30,
      snack: 0.10
    };
    return ratios[mealType] || 0.25;
  }

  /**
   * Get meal protein ratio based on meal type
   */
  getMealProteinRatio(mealType) {
    const ratios = {
      breakfast: 0.20,
      lunch: 0.35,
      dinner: 0.35,
      snack: 0.10
    };
    return ratios[mealType] || 0.25;
  }

  /**
   * Dynamic fallback responses when API is not available
   */
  getFallbackResponse(prompt, options = {}) {
    const lowerPrompt = prompt.toLowerCase();
    const isStructuredRequest = options.isStructuredRequest || false;
    const userProfile = options.userProfile || {};
    
    // Structured data requests (for meal/workout plan generation)
    if (isStructuredRequest) {
      return this.generateStructuredFallbackData(lowerPrompt, userProfile);
    }
    
    // Conversational responses
    return this.generateDynamicConversationalResponse(lowerPrompt, userProfile);
  }

  /**
   * Generate dynamic structured fallback data for meal/workout plans
   */
  generateStructuredFallbackData(lowerPrompt, userProfile) {
    if (lowerPrompt.includes('meal plan') || lowerPrompt.includes('nutrition')) {
      const nutritionNeeds = this.calculateNutritionalNeeds(userProfile);
      const mealSuggestions = this.generateDynamicMealSuggestions(userProfile, 'breakfast');
      
      return JSON.stringify({
        "meals": [
          {
            "name": `Personalized ${mealSuggestions.suggested_proteins[0] || 'Protein'} Bowl`,
            "type": "breakfast",
            "ingredients": [
              {"name": mealSuggestions.suggested_carbs[0] || "oats", "quantity": "1", "unit": "cup"},
              {"name": mealSuggestions.suggested_proteins[0] || "protein source", "quantity": "1", "unit": "serving"},
              {"name": mealSuggestions.suggested_fats[0] || "nuts", "quantity": "1", "unit": "tablespoon"}
            ],
            "instructions": `Combine ${mealSuggestions.suggested_carbs[0] || 'base'} with ${mealSuggestions.suggested_proteins[0] || 'protein'} and top with ${mealSuggestions.suggested_fats[0] || 'healthy fats'}`,
            "prep_time": 10,
            "cook_time": 5,
            "servings": 1,
            "nutrition": {
              "calories": mealSuggestions.target_calories,
              "protein": mealSuggestions.target_protein,
              "carbs": Math.round(mealSuggestions.target_calories * 0.5 / 4),
              "fat": Math.round(mealSuggestions.target_calories * 0.25 / 9),
              "fiber": Math.round(nutritionNeeds.fiber * 0.3),
              "sugar": Math.round(mealSuggestions.target_calories * 0.1 / 4),
              "sodium": Math.round(mealSuggestions.target_calories * 0.5)
            },
            "dietary_tags": [userProfile.dietaryPreference || "balanced", "personalized"],
            "difficulty": userProfile.fitnessLevel || "easy"
          }
        ],
        "total_nutrition": {
          "calories": nutritionNeeds.calories,
          "protein": nutritionNeeds.protein,
          "carbs": nutritionNeeds.carbs,
          "fat": nutritionNeeds.fat,
          "fiber": nutritionNeeds.fiber,
          "sugar": Math.round(nutritionNeeds.calories * 0.1 / 4),
          "sodium": Math.round(nutritionNeeds.calories * 1.2)
        },
        "hydration_goal": nutritionNeeds.water,
        "daily_tips": [
          `Focus on ${userProfile.fitnessGoal || 'your health goals'}`,
          `Stay consistent with your ${userProfile.dietaryPreference || 'balanced'} diet`
        ],
        "meal_timing": {
          "breakfast": "7:00 AM",
          "lunch": "12:00 PM",
          "snack": "3:00 PM",
          "dinner": "7:00 PM"
        }
      });
    }
    
    if (lowerPrompt.includes('workout') || lowerPrompt.includes('exercise')) {
      const workoutRec = this.generateDynamicWorkoutRecommendations(userProfile);
      const selectedCardio = workoutRec.recommended_cardio[0] || 'walking';
      const selectedStrength = workoutRec.recommended_strength[0] || 'push-ups';
      
      return JSON.stringify({
        "name": `${userProfile.fitnessGoal || 'Fitness'} Focused Plan`,
        "type": "mixed",
        "duration": workoutRec.duration,
        "warm_up": [
          {
            "name": "Dynamic Warm-up",
            "type": "cardio",
            "duration": 5,
            "instructions": `Start with light ${selectedCardio} to prepare your body`,
            "difficulty": workoutRec.difficulty
          }
        ],
        "exercises": [
          {
            "name": selectedStrength,
            "type": "strength",
            "muscle_groups": ["full_body"],
            "equipment": workoutRec.equipment_needed,
            "sets": userProfile.fitnessLevel === 'beginner' ? 2 : 3,
            "reps": userProfile.fitnessLevel === 'beginner' ? "8-10" : "10-15",
            "rest_time": userProfile.fitnessLevel === 'beginner' ? 90 : 60,
            "instructions": `Perform ${selectedStrength} with proper form`,
            "difficulty": workoutRec.difficulty,
            "calories_burned_per_minute": userProfile.fitnessLevel === 'beginner' ? 6 : 10
          }
        ],
        "cool_down": [
          {
            "name": "Flexibility Work",
            "type": "flexibility",
            "duration": 5,
            "instructions": "Focus on stretching the muscles you just worked",
            "difficulty": workoutRec.difficulty
          }
        ],
        "target_muscle_groups": ["full_body"],
        "estimated_calories": Math.round(workoutRec.duration * 8 * (userProfile.fitnessLevel === 'beginner' ? 0.8 : 1.2)),
        "safety_tips": [
          "Listen to your body and rest when needed",
          `Adjust intensity based on your ${workoutRec.difficulty} level`
        ],
        "progression_notes": `Progress by increasing ${userProfile.fitnessGoal?.includes('strength') ? 'reps/sets' : 'duration/intensity'}`
      });
    }
    
    return "{}";
  }

  /**
   * Generate dynamic conversational responses based on user input and profile
   */
  generateDynamicConversationalResponse(lowerPrompt, userProfile = {}) {
    const { name, fitnessGoal, fitnessLevel, dietaryPreference, age, weight } = userProfile;
    const userName = name ? `, ${name}` : '';
    
    // Greetings (highest priority)
    if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi') || lowerPrompt.includes('hey')) {
      const personalizedGreeting = fitnessGoal 
        ? `Hello${userName}! I'm FitGenie, your AI fitness companion. I see you're working towards ${fitnessGoal} - that's fantastic! How can I help you today? 😊`
        : `Hello${userName}! I'm FitGenie, your AI fitness companion. I'm here to help you with nutrition advice, workout suggestions, and health-related questions. How can I assist you today? 😊`;
      return personalizedGreeting;
    }
    
    // Motivation
    if (lowerPrompt.includes('motivation') || lowerPrompt.includes('motivate')) {
      const personalizedMotivation = fitnessGoal 
        ? `${userName ? name : 'You'}, your ${fitnessGoal} journey is unique and valuable! Every step you take brings you closer to your goals. ${fitnessLevel === 'beginner' ? 'Starting is the hardest part, and you\'ve already done that!' : 'Keep building on the progress you\'ve made!'} 💪`
        : `Remember${userName}, every small step counts! Consistency is more important than perfection. You've got this! 💪`;
      return personalizedMotivation;
    }
    
    // Breakfast suggestions
    if (lowerPrompt.includes('breakfast') || (lowerPrompt.includes('eat') && lowerPrompt.includes('morning'))) {
      const nutritionNeeds = this.calculateNutritionalNeeds(userProfile);
      const mealSuggestions = this.generateDynamicMealSuggestions(userProfile, 'breakfast');
      
      return `Great question about breakfast${userName}! Based on your profile, I'd recommend:\n\n` +
        `🎯 **Target**: ~${mealSuggestions.target_calories} calories, ${mealSuggestions.target_protein}g protein\n\n` +
        `🥗 **Protein options**: ${mealSuggestions.suggested_proteins.join(', ')}\n` +
        `🌾 **Carb options**: ${mealSuggestions.suggested_carbs.join(', ')}\n` +
        `🥑 **Healthy fats**: ${mealSuggestions.suggested_fats.join(', ')}\n\n` +
        `💡 **Timing**: ${mealSuggestions.timing}\n\n` +
        `This combination will support your ${fitnessGoal || 'health goals'} while fitting your ${dietaryPreference || 'dietary'} preferences!`;
    }
    
    // Workout suggestions
    if (lowerPrompt.includes('workout') || lowerPrompt.includes('exercise') || lowerPrompt.includes('fitness')) {
      const workoutRec = this.generateDynamicWorkoutRecommendations(userProfile);
      
      return `Perfect${userName}! Here's a personalized workout recommendation:\n\n` +
        `⏱️ **Duration**: ${workoutRec.duration} minutes\n` +
        `🎯 **Focus**: ${workoutRec.cardio_focus}% cardio, ${workoutRec.strength_focus}% strength (optimal for ${fitnessGoal || 'fitness'})\n` +
        `💪 **Level**: ${workoutRec.difficulty}\n\n` +
        `🏃 **Cardio options**: ${workoutRec.recommended_cardio.join(', ')}\n` +
        `🏋️ **Strength options**: ${workoutRec.recommended_strength.join(', ')}\n` +
        `🛠️ **Equipment**: ${workoutRec.equipment_needed.join(', ')}\n\n` +
        `This plan is designed specifically for your ${fitnessLevel || 'current'} fitness level and ${fitnessGoal || 'goals'}!`;
    }
    
    // Specific health goals
    if (lowerPrompt.includes('weight loss') || lowerPrompt.includes('lose weight')) {
      const nutritionNeeds = this.calculateNutritionalNeeds(userProfile);
      const calorieDeficit = weight ? Math.round(weight * 7.7) : 500; // Rough estimate
      
      return `Great goal${userName}! Here's your personalized weight loss strategy:\n\n` +
        `🎯 **Target**: ${nutritionNeeds.calories} calories/day (${calorieDeficit} calorie deficit)\n` +
        `🥗 **Nutrition**: ${nutritionNeeds.protein}g protein, ${nutritionNeeds.carbs}g carbs, ${nutritionNeeds.fat}g fat\n` +
        `🏃 **Exercise**: Focus on ${this.fitnessGoals.weight_loss.cardio_focus}% cardio, ${this.fitnessGoals.weight_loss.strength_focus}% strength\n` +
        `� **Hydration**: ${nutritionNeeds.water}ml water daily\n\n` +
        `${age && age > 40 ? 'At your age, prioritize sustainable changes and adequate recovery. ' : ''}What aspect would you like to focus on first?`;
    }
    
    if (lowerPrompt.includes('muscle') || lowerPrompt.includes('build') || lowerPrompt.includes('gain')) {
      const nutritionNeeds = this.calculateNutritionalNeeds(userProfile);
      
      return `Excellent goal${userName}! Here's your muscle building roadmap:\n\n` +
        `💪 **Nutrition**: ${nutritionNeeds.calories} calories/day with ${nutritionNeeds.protein}g protein (${nutritionNeeds.protein/weight || 1.6}g per kg bodyweight)\n` +
        `🏋️ **Training**: Focus on ${this.fitnessGoals.muscle_gain.strength_focus}% strength training, ${this.fitnessGoals.muscle_gain.cardio_focus}% cardio\n` +
        `😴 **Recovery**: ${fitnessLevel === 'beginner' ? '48-72 hours rest between muscle groups' : '24-48 hours rest between sessions'}\n` +
        `⏰ **Frequency**: ${fitnessLevel === 'beginner' ? '3-4 days/week' : '4-6 days/week'}\n\n` +
        `Your ${fitnessLevel || 'current'} level is perfect for ${fitnessLevel === 'beginner' ? 'building a strong foundation' : 'advancing your muscle-building journey'}!`;
    }
    
    if (lowerPrompt.includes('tired') || lowerPrompt.includes('energy') || lowerPrompt.includes('fatigue')) {
      const hydrationNeeds = weight ? Math.round(weight * 35) : 2500;
      
      return `I understand${userName}! Let's boost your energy naturally:\n\n` +
        `💧 **Hydration**: Aim for ${hydrationNeeds}ml water daily (based on your profile)\n` +
        `🥗 **Nutrition**: ${fitnessGoal?.includes('weight') ? 'Maintain your calorie goals while' : 'Focus on'} eating every 3-4 hours\n` +
        `🚶 **Movement**: Even 10-15 minutes of ${fitnessLevel === 'beginner' ? 'walking' : 'light exercise'} can increase energy\n` +
        `😴 **Sleep**: ${age && age > 40 ? '7-9 hours' : '7-8 hours'} quality sleep is crucial\n\n` +
        `${dietaryPreference ? `With your ${dietaryPreference} diet, focus on iron-rich foods and B-vitamins. ` : ''}When do you typically feel most tired?`;
    }
    
    // General nutrition advice
    if (lowerPrompt.includes('eat') || lowerPrompt.includes('food') || lowerPrompt.includes('nutrition')) {
      const nutritionNeeds = this.calculateNutritionalNeeds(userProfile);
      
      return `Excellent question${userName}! Here's your personalized nutrition guidance:\n\n` +
        `📊 **Your targets**: ${nutritionNeeds.calories} calories, ${nutritionNeeds.protein}g protein, ${nutritionNeeds.fiber}g fiber\n` +
        `🥗 **Balance**: Each meal should have protein, healthy fats, and complex carbs\n` +
        `⏰ **Timing**: Eat every 3-4 hours to maintain steady energy\n` +
        `💧 **Hydration**: ${nutritionNeeds.water}ml water throughout the day\n\n` +
        `${dietaryPreference ? `For your ${dietaryPreference} diet, ` : ''}${fitnessGoal ? `focus on foods that support your ${fitnessGoal} goals. ` : ''}What specific meal or nutrition goal are you working towards?`;
    }
    
    // Default response
    return `Hi${userName}! I'm here to provide personalized fitness and nutrition advice${userProfile.fitnessGoal ? ` tailored to your ${userProfile.fitnessGoal} goal` : ''}! I can help you with:\n\n` +
      `🍎 **Nutrition**: Personalized meal plans and eating strategies\n` +
      `💪 **Workouts**: ${fitnessLevel ? `${fitnessLevel}-level` : 'Customized'} exercise routines\n` +
      `🎯 **Goals**: ${fitnessGoal ? `Your ${fitnessGoal} journey` : 'Weight loss, muscle building, wellness'}\n` +
      `🧠 **Motivation**: Encouragement and tips to stay consistent\n\n` +
      `${age && weight ? `Based on your profile (${age} years, ${weight}kg), I can provide very specific recommendations. ` : ''}What would you like to explore first?`;
  }

  // ==================== CORE AI SERVICE METHODS ====================

  /**
   * Generate a personalized meal plan
   */
  async generateMealPlan(userProfile) {
    const {
      age, weight, height, gender, activityLevel, fitnessGoal, 
      dietaryPreference, allergies, dailyCalorieTarget
    } = userProfile;

    const prompt = `Create a detailed daily meal plan for a ${age}-year-old ${gender} (${weight}kg, ${height}cm) with ${activityLevel} activity level.
    
    Goals: ${fitnessGoal}
    Diet: ${dietaryPreference}
    Allergies: ${allergies?.join(', ') || 'None'}
    Daily Calories: ${dailyCalorieTarget}
    
    Provide a complete JSON meal plan with breakfast, lunch, dinner, and snacks. Include nutritional information, ingredients, and cooking instructions.`;

    try {
      const result = await this.callOpenAI(prompt, {
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 2000,
        isStructuredRequest: true,
        userProfile: userProfile
      });
      
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse meal plan JSON response');
    } catch (error) {
      console.error('Error generating meal plan:', error);
      throw new Error('Failed to generate meal plan');
    }
  }

  /**
   * Generate a personalized workout plan
   */
  async generateWorkoutPlan(userProfile) {
    const {
      age, weight, height, gender, activityLevel, fitnessGoal, 
      fitnessLevel, workoutDaysPerWeek, workoutDuration, availableEquipment
    } = userProfile;

    const prompt = `Create a ${workoutDuration}-minute workout plan for a ${age}-year-old ${gender} (${weight}kg, ${height}cm).
    
    Fitness Level: ${fitnessLevel}
    Goal: ${fitnessGoal}
    Frequency: ${workoutDaysPerWeek} days/week
    Equipment: ${availableEquipment?.join(', ') || 'None'}
    
    Provide a complete JSON workout plan with warm-up, exercises, and cool-down. Include sets, reps, and detailed instructions.`;

    try {
      const result = await this.callOpenAI(prompt, {
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 2000,
        isStructuredRequest: true,
        userProfile: userProfile
      });
      
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse workout plan JSON response');
    } catch (error) {
      console.error('Error generating workout plan:', error);
      throw new Error('Failed to generate workout plan');
    }
  }

  /**
   * Generate holistic health plan combining meal and workout
   */
  async generateHolisticHealthPlan(userProfile, mealPlan, workoutPlan) {
    const { name, fitnessGoal, age } = userProfile;

    const prompt = `Create a motivational health strategy for ${name}, age ${age}, with goal: ${fitnessGoal}.
    
    Meal Plan: ${mealPlan.total_nutrition?.calories || 'N/A'} calories, ${mealPlan.total_nutrition?.protein || 'N/A'}g protein
    Workout Plan: ${workoutPlan.duration || 'N/A'} minutes, ${workoutPlan.estimated_calories || 'N/A'} calories burned
    
    Provide encouragement and practical tips for success (under 300 words).`;

    try {
      const result = await this.callOpenAI(prompt, {
        model: 'gpt-3.5-turbo',
        temperature: 0.8,
        max_tokens: 500,
        userProfile: userProfile
      });
      return result;
    } catch (error) {
      console.error('Error generating holistic plan:', error);
      return `Hello ${name}! Your personalized health plan has been created to help you achieve your ${fitnessGoal} goal. Remember, consistency is key to success!`;
    }
  }

  /**
   * Generate lifestyle tips based on user profile
   */
  async generateLifestyleTips(userProfile) {
    const { fitnessGoal, activityLevel, age, fitnessLevel, dietaryPreference } = userProfile;

    const prompt = `Generate 5 lifestyle tips for someone: Age ${age}, Goal: ${fitnessGoal}, Activity: ${activityLevel}. Return as JSON array.`;

    try {
      const result = await this.callOpenAI(prompt, {
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 300
      });
      
      const jsonMatch = result.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Dynamic fallback tips based on user profile
      const dynamicTips = [
        `Stay hydrated - aim for ${userProfile.weight ? Math.round(userProfile.weight * 35) : 2500}ml daily`,
        `Get ${age && age > 40 ? '7-9' : '7-8'} hours of quality sleep for optimal recovery`,
        `Focus on consistency over perfection with your ${fitnessGoal || 'health goals'}`,
        `${fitnessLevel === 'beginner' ? 'Start slowly and gradually increase intensity' : 'Challenge yourself while listening to your body'}`,
        `${dietaryPreference ? `Ensure adequate nutrients with your ${dietaryPreference} diet` : 'Eat a variety of colorful whole foods'}`
      ];
      
      return dynamicTips;
    } catch (error) {
      console.error('Error generating lifestyle tips:', error);
      return [
        "Stay consistent with your routine",
        "Focus on gradual progress",
        "Prioritize recovery and rest"
      ];
    }
  }

  /**
   * Search for health information
   */
  async searchHealthInfo(query) {
    const prompt = `Provide evidence-based information about: "${query}". Include scientific accuracy, practical applications, and safety considerations. Keep under 200 words.`;

    try {
      const result = await this.callOpenAI(prompt, {
        model: 'gpt-3.5-turbo',
        temperature: 0.5,
        max_tokens: 400
      });
      return result;
    } catch (error) {
      console.error('Error searching health info:', error);
      return 'Unable to retrieve additional information at this time.';
    }
  }

  /**
   * Generate chatbot response (main conversational interface)
   */
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
