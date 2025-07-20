# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import Optional
# import os
# import asyncio
# from agno.agent import Agent
# from agno.models.google import Gemini
# from agno.tools.duckduckgo import DuckDuckGoTools

# # Initialize FastAPI app
# app = FastAPI(title="AI Health & Fitness Plan Generator", version="1.0.0")

# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # In production, specify your frontend URL
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Request model
# class HealthPlanRequest(BaseModel):
#     name: str
#     age: int
#     weight: float
#     height: float
#     activity_level: str
#     dietary_preference: str
#     fitness_goal: str
#     workout_focus: Optional[str] = "full_body"
#     meal_complexity: Optional[str] = "moderate"
#     special_requests: Optional[str] = ""
#     google_api_key: str

# # Response model
# class HealthPlanResponse(BaseModel):
#     success: bool
#     message: str
#     meal_plan: str
#     workout_plan: str
#     full_plan: str
#     summary: str

# # Initialize AI agents
# def initialize_agents(api_key: str):
#     os.environ["GOOGLE_API_KEY"] = api_key
    
#     # Dietary Planner Agent
#     dietary_planner = Agent(
#         model=Gemini(id="gemini-2.0-flash-exp"),
#         description="Creates personalized dietary plans based on user input.",
#         instructions=[
#             "Generate a detailed diet plan with breakfast, lunch, dinner, and snacks.",
#             "Consider dietary preferences like Keto, Vegetarian, or Low Carb.",
#             "Ensure proper hydration and electrolyte balance.",
#             "Provide nutritional breakdown including macronutrients and vitamins.",
#             "Suggest meal preparation tips for easy implementation.",
#             "Include specific food items, portions, and cooking methods.",
#             "Consider the user's fitness goals when planning meals.",
#             "If necessary, search the web using DuckDuckGo for additional information.",
#         ],
#         tools=[DuckDuckGoTools()],
#         show_tool_calls=False,
#         markdown=True
#     )

#     # Fitness Trainer Agent
#     fitness_trainer = Agent(
#         model=Gemini(id="gemini-2.0-flash-exp"),
#         description="Generates customized workout routines based on fitness goals.",
#         instructions=[
#             "Create a detailed workout plan including warm-ups, main exercises, and cool-downs.",
#             "Adjust workouts based on fitness level and activity level provided.",
#             "Consider weight loss, muscle gain, endurance, or flexibility goals.",
#             "Include specific exercises with sets, reps, and rest periods.",
#             "Provide safety tips and injury prevention advice.",
#             "Suggest progress tracking methods for motivation.",
#             "Include workout modifications for different fitness levels.",
#             "If necessary, search the web using DuckDuckGo for additional information.",
#         ],
#         tools=[DuckDuckGoTools()],
#         show_tool_calls=False,
#         markdown=True
#     )

#     # Team Lead Agent
#     team_lead = Agent(
#         model=Gemini(id="gemini-2.0-flash-exp"),
#         description="Combines diet and workout plans into a holistic health strategy.",
#         instructions=[
#             "Merge personalized diet and fitness plans for a comprehensive approach.",
#             "Ensure alignment between diet and exercise for optimal results.",
#             "Provide lifestyle tips for motivation and consistency.",
#             "Create a structured plan with clear daily/weekly schedules.",
#             "Include hydration recommendations and sleep guidelines.",
#             "Provide guidance on tracking progress and adjusting plans over time.",
#             "Address any special requests or considerations mentioned by the user.",
#             "Use tables and structured formatting where appropriate for clarity."
#         ],
#         markdown=True
#     )
    
#     return dietary_planner, fitness_trainer, team_lead

# @app.post("/generate-health-plan", response_model=HealthPlanResponse)
# async def generate_health_plan(request: HealthPlanRequest):
#     try:
#         # Initialize agents with the provided API key
#         dietary_planner, fitness_trainer, team_lead = initialize_agents(request.google_api_key)
        
#         # Generate meal plan
#         meal_prompt = (
#             f"Create a personalized meal plan for {request.name}, a {request.age}-year-old person, "
#             f"weighing {request.weight}kg, {request.height}cm tall, with an activity level of "
#             f"'{request.activity_level}', following a '{request.dietary_preference}' diet, "
#             f"aiming to achieve '{request.fitness_goal}'. "
#             f"Meal complexity preference: {request.meal_complexity}. "
#             f"Workout focus: {request.workout_focus}. "
#         )
        
#         if request.special_requests:
#             meal_prompt += f"Special requests/considerations: {request.special_requests}"
            
#         print(f"Generating meal plan for {request.name}...")
#         meal_plan_result = dietary_planner.run(meal_prompt)
#         meal_plan = meal_plan_result.content if hasattr(meal_plan_result, 'content') else str(meal_plan_result)
        
#         # Generate fitness plan
#         fitness_prompt = (
#             f"Generate a comprehensive workout plan for {request.name}, a {request.age}-year-old person, "
#             f"weighing {request.weight}kg, {request.height}cm tall, with an activity level of "
#             f"'{request.activity_level}', aiming to achieve '{request.fitness_goal}'. "
#             f"Workout focus: {request.workout_focus}. "
#             f"Include warm-ups, main exercises with sets/reps, and cool-downs. "
#         )
        
#         if request.special_requests:
#             fitness_prompt += f"Special requests/considerations: {request.special_requests}"
            
#         print(f"Generating fitness plan for {request.name}...")
#         fitness_plan_result = fitness_trainer.run(fitness_prompt)
#         fitness_plan = fitness_plan_result.content if hasattr(fitness_plan_result, 'content') else str(fitness_plan_result)
        
#         # Combine into holistic plan
#         combined_prompt = (
#             f"Create a comprehensive, personalized health strategy for {request.name}.\n\n"
#             f"User Profile:\n"
#             f"- Name: {request.name}\n"
#             f"- Age: {request.age} years\n"
#             f"- Weight: {request.weight}kg\n"
#             f"- Height: {request.height}cm\n"
#             f"- Activity Level: {request.activity_level}\n"
#             f"- Dietary Preference: {request.dietary_preference}\n"
#             f"- Fitness Goal: {request.fitness_goal}\n"
#             f"- Workout Focus: {request.workout_focus}\n"
#             f"- Meal Complexity: {request.meal_complexity}\n"
#         )
        
#         if request.special_requests:
#             combined_prompt += f"- Special Requests: {request.special_requests}\n"
            
#         combined_prompt += (
#             f"\n\nMeal Plan:\n{meal_plan}\n\n"
#             f"Workout Plan:\n{fitness_plan}\n\n"
#             f"Please provide a holistic health strategy that integrates both plans with:\n"
#             f"1. A personalized greeting for {request.name}\n"
#             f"2. A summary of recommendations\n"
#             f"3. Daily/weekly schedule integration\n"
#             f"4. Lifestyle tips for success\n"
#             f"5. Progress tracking suggestions\n"
#             f"6. Motivation and consistency advice"
#         )
        
#         print(f"Creating integrated health plan for {request.name}...")
#         full_plan_result = team_lead.run(combined_prompt)
#         full_plan = full_plan_result.content if hasattr(full_plan_result, 'content') else str(full_plan_result)
        
#         # Create summary
#         summary = (
#             f"Personalized health and fitness plan generated for {request.name} "
#             f"({request.age} years old, {request.fitness_goal.lower()}). "
#             f"Includes {request.dietary_preference.lower()} meal plan and "
#             f"{request.workout_focus.replace('_', ' ')} focused workout routine."
#         )
        
#         return HealthPlanResponse(
#             success=True,
#             message="Health plan generated successfully!",
#             meal_plan=meal_plan,
#             workout_plan=fitness_plan,
#             full_plan=full_plan,
#             summary=summary
#         )
        
#     except Exception as e:
#         print(f"Error generating health plan: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error generating health plan: {str(e)}")

# @app.get("/health")
# async def health_check():
#     return {"status": "healthy", "message": "AI Health & Fitness Plan Generator API is running"}

# @app.get("/")
# async def root():
#     return {
#         "message": "AI Health & Fitness Plan Generator API",
#         "version": "1.0.0",
#         "endpoints": {
#             "generate_plan": "/generate-health-plan",
#             "health": "/health"
#         }
#     }

# # For testing purposes
# @app.get("/test-agents")
# async def test_agents():
#     """Test endpoint to verify agents are working"""
#     try:
#         test_api_key = "AIzaSyCr35hxFrpVsbNWgqOwU6PwmkpwLmO2dJA"  # Your hardcoded key
#         dietary_planner, fitness_trainer, team_lead = initialize_agents(test_api_key)
        
#         # Simple test
#         test_result = dietary_planner.run("Give me a simple breakfast idea for weight loss")
        
#         return {
#             "success": True,
#             "message": "Agents initialized successfully",
#             "test_result": test_result.content if hasattr(test_result, 'content') else str(test_result)
#         }
#     except Exception as e:
#         return {
#             "success": False,
#             "error": str(e)
#         }

# if __name__ == "__main__":
#     import uvicorn
#     print("Starting AI Health & Fitness Plan Generator API...")
#     print("API will be available at: http://localhost:8000")
#     print("API documentation at: http://localhost:8000/docs")
#     uvicorn.run(app, host="0.0.0.0", port=8000)


# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import google.generativeai as genai
# from duckduckgo_search import DDGS
# from dotenv import load_dotenv
# import os
# import smtplib
# from email.mime.text import MIMEText
# from email.mime.multipart import MIMEMultipart
# import logging

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Load environment variables
# load_dotenv()

# # Initialize FastAPI app
# app = FastAPI(title="AI Health & Fitness Plan Generator")

# # Configure CORS to allow frontend requests
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # Frontend origin
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Configure Gemini API
# GOOGLE_API_KEY = "AIzaSyCr35hxFrpVsbNWgqOwU6PwmkpwLmO2dJA"
# if not GOOGLE_API_KEY:
#     logger.error("GOOGLE_API_KEY not found in .env file")
#     raise ValueError("GOOGLE_API_KEY is required")
# genai.configure(api_key=GOOGLE_API_KEY)

# # Pydantic models for request validation
# class MealPreferences(BaseModel):
#     meals_per_day: int = 3
#     snacks_included: bool = True
#     cooking_time: str = "moderate"
#     allergies: str = ""
#     specific_goals: str = ""

# class WorkoutPreferences(BaseModel):
#     workouts_per_week: int = 3
#     session_duration: int = 30
#     equipment_available: str = "gym"
#     focus_areas: list[str] = []
#     injury_limitations: str = ""
#     specific_goals: str = ""

# class HealthPlanRequest(BaseModel):
#     name: str
#     age: int
#     weight: float
#     height: float
#     activity_level: str
#     dietary_preference: str
#     fitness_goal: str
#     meal_preferences: MealPreferences | None = None
#     workout_preferences: WorkoutPreferences | None = None

# class HealthPlanResponse(BaseModel):
#     content: str

# class EmailPlanRequest(BaseModel):
#     plan: dict
#     email: str

# def generate_workout_plan(user_data: HealthPlanRequest, preferences: WorkoutPreferences) -> str:
#     """Generate a workout plan using Gemini and DuckDuckGo."""
#     try:
#         model = genai.GenerativeModel("gemini-1.5-pro")
#         focus = ", ".join(preferences.focus_areas) if preferences.focus_areas else user_data.fitness_goal
#         prompt = f"""
#         Create a personalized workout plan for a {user_data.age}-year-old {user_data.activity_level.lower()} individual 
#         with fitness goal: {user_data.fitness_goal}. 
#         Workouts per week: {preferences.workouts_per_week}, 
#         session duration: {preferences.session_duration} minutes, 
#         equipment: {preferences.equipment_available}, 
#         focus areas: {focus}, 
#         injury limitations: {preferences.injury_limitations or 'none'}.
#         Specific goals: {preferences.specific_goals or 'none'}.

#         Format as a markdown table with columns: 
#         | Name | Sets | Reps | Rest Time | Description | Muscles | Difficulty |
#         """
#         response = model.generate_content(prompt)
#         if not response.text:
#             raise ValueError("Empty response from Gemini API")

#         # Enhance with DuckDuckGo search for exercise details
#         with DDGS() as ddgs:
#             search_query = f"{focus} exercises {preferences.equipment_available}"
#             results = list(ddgs.text(search_query, max_results=3))
#             descriptions = "\n".join([f"- {r['title']}: {r['body'][:200]}" for r in results])
#             return f"## Workout Plan\n{response.text}\n\n### Additional Info\n{descriptions}"
#     except Exception as e:
#         logger.error(f"Error generating workout plan: {str(e)}")
#         raise HTTPException(status_code=503, detail=f"Failed to generate workout plan: {str(e)}")

# def generate_meal_plan(user_data: HealthPlanRequest, preferences: MealPreferences) -> str:
#     """Generate a meal plan using Gemini and DuckDuckGo."""
#     try:
#         model = genai.GenerativeModel("gemini-1.5-pro")
#         prompt = f"""
#         Create a personalized meal plan for a {user_data.age}-year-old individual 
#         with dietary preference: {user_data.dietary_preference}, 
#         fitness goal: {user_data.fitness_goal}, 
#         allergies: {preferences.allergies or 'none'}, 
#         meals per day: {preferences.meals_per_day}, 
#         snacks: {'included' if preferences.snacks_included else 'excluded'}, 
#         cooking time: {preferences.cooking_time}.
#         Specific goals: {preferences.specific_goals or 'none'}.

#         Format as a markdown table with columns: 
#         | Name | Type | Calories | Protein | Carbs | Fat | Prep Time | Description | Ingredients | Cuisine | Difficulty |
#         """
#         response = model.generate_content(prompt)
#         if not response.text:
#             raise ValueError("Empty response from Gemini API")

#         # Enhance with DuckDuckGo search for recipes
#         with DDGS() as ddgs:
#             search_query = f"{user_data.dietary_preference} recipes {preferences.cooking_time}"
#             results = list(ddgs.text(search_query, max_results=3))
#             recipes = "\n".join([f"- {r['title']}: {r['body'][:200]}" for r in results])
#             return f"## Meal Plan\n{response.text}\n\n### Additional Info\n{recipes}"
#     except Exception as e:
#         logger.error(f"Error generating meal plan: {str(e)}")
#         raise HTTPException(status_code=503, detail=f"Failed to generate meal plan: {str(e)}")

# def generate_lifestyle_tips(user_data: HealthPlanRequest) -> str:
#     """Generate lifestyle tips using Gemini."""
#     try:
#         model = genai.GenerativeModel("gemini-1.5-pro")
#         prompt = f"""
#         Provide lifestyle tips for a {user_data.age}-year-old individual 
#         with fitness goal: {user_data.fitness_goal} and 
#         activity level: {user_data.activity_level}.
#         Format as a markdown list.
#         """
#         response = model.generate_content(prompt)
#         return f"## Lifestyle Tips\n{response.text}"
#     except Exception as e:
#         logger.error(f"Error generating lifestyle tips: {str(e)}")
#         raise HTTPException(status_code=503, detail=f"Failed to generate lifestyle tips: {str(e)}")

# def generate_ai_recommendations(user_data: HealthPlanRequest) -> str:
#     """Generate AI recommendations using Gemini."""
#     try:
#         model = genai.GenerativeModel("gemini-1.5-pro")
#         prompt = f"""
#         Provide personalized health recommendations for a {user_data.age}-year-old, 
#         weight: {user_data.weight}kg, height: {user_data.height}cm, 
#         activity level: {user_data.activity_level}, 
#         fitness goal: {user_data.fitness_goal}, 
#         dietary preference: {user_data.dietary_preference}.
#         Format as markdown paragraphs.
#         """
#         response = model.generate_content(prompt)
#         return f"## AI Recommendations\n{response.text}"
#     except Exception as e:
#         logger.error(f"Error generating AI recommendations: {str(e)}")
#         raise HTTPException(status_code=503, detail=f"Failed to generate AI recommendations: {str(e)}")

# @app.post("/generate-health-plan", response_model=HealthPlanResponse)
# async def generate_health_plan(request: HealthPlanRequest):
#     """Generate a personalized health and fitness plan."""
#     try:
#         content = []
        
#         # Generate AI recommendations
#         content.append(generate_ai_recommendations(request))
        
#         # Generate workout plan if requested
#         if request.workout_preferences:
#             workout_plan = generate_workout_plan(request, request.workout_preferences)
#             content.append(workout_plan)
        
#         # Generate meal plan if requested
#         if request.meal_preferences:
#             meal_plan = generate_meal_plan(request, request.meal_preferences)
#             content.append(meal_plan)
        
#         # Generate lifestyle tips
#         content.append(generate_lifestyle_tips(request))
        
#         # Combine all sections
#         full_content = "\n\n".join(content)
#         return HealthPlanResponse(content=full_content)
#     except Exception as e:
#         logger.error(f"Error in generate_health_plan: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Failed to generate health plan: {str(e)}")

# @app.post("/email-health-plan")
# async def email_health_plan(request: EmailPlanRequest):
#     """Send the generated plan to the user's email."""
#     try:
#         # Email configuration
#         smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
#         smtp_port = int(os.getenv("SMTP_PORT", 587))
#         smtp_user = os.getenv("SMTP_USER")
#         smtp_password = os.getenv("SMTP_PASSWORD")
        
#         if not all([smtp_user, smtp_password]):
#             raise ValueError("SMTP credentials not configured")

#         # Format plan as plain text
#         plan_content = (
#             f"{request.plan.get('plan_name', 'Health Plan')}\n\n"
#             f"Generated on: {request.plan.get('generated_date', 'Today')}\n\n"
#             f"AI Recommendations:\n{request.plan.get('ai_recommendations', 'N/A')}\n\n"
#         )
        
#         if request.plan.get("workout_plan"):
#             plan_content += (
#                 f"Workout Plan:\n"
#                 f"Duration: {request.plan['workout_plan'].get('duration', 'N/A')} minutes\n"
#                 f"Frequency: {request.plan['workout_plan'].get('frequency', 'N/A')}\n"
#                 f"Equipment: {request.plan['workout_plan'].get('equipment', 'N/A')}\n\n"
#                 f"Exercises:\n"
#             )
#             for i, ex in enumerate(request.plan["workout_plan"].get("exercises", []), 1):
#                 plan_content += (
#                     f"{i}. {ex.get('name', 'Unknown')}\n"
#                     f"   Sets: {ex.get('sets', 'N/A')} | Reps: {ex.get('reps', 'N/A')} | Rest: {ex.get('restTime', 'N/A')}\n"
#                     f"   {ex.get('description', 'No description')}\n"
#                 )
        
#         if request.plan.get("meal_plan"):
#             plan_content += (
#                 f"\nMeal Plan:\n"
#                 f"Total Calories: {request.plan['meal_plan'].get('total_nutrition', {}).get('calories', 'N/A')} kcal\n"
#                 f"Total Protein: {request.plan['meal_plan'].get('total_nutrition', {}).get('protein', 'N/A')}g\n\n"
#                 f"Meals:\n"
#             )
#             for i, meal in enumerate(request.plan["meal_plan"].get("meals", []), 1):
#                 plan_content += (
#                     f"{i}. {meal.get('name', 'Unknown')} ({meal.get('type', 'N/A')})\n"
#                     f"   Calories: {meal.get('nutrition', {}).get('calories', 'N/A')} | Protein: {meal.get('nutrition', {}).get('protein', 'N/A')}g\n"
#                     f"   Prep time: {meal.get('prep_time', 'N/A')} minutes\n"
#                     f"   {meal.get('description', 'No description')}\n"
#                 )
        
#         if request.plan.get("lifestyle_tips"):
#             plan_content += "\nLifestyle Tips:\n"
#             for i, tip in enumerate(request.plan["lifestyle_tips"], 1):
#                 plan_content += f"{i}. {tip}\n"

#         # Set up email
#         msg = MIMEMultipart()
#         msg["From"] = smtp_user
#         msg["To"] = request.email
#         msg["Subject"] = "Your Personalized Health & Fitness Plan"
#         msg.attach(MIMEText(plan_content, "plain"))

#         # Send email
#         with smtplib.SMTP(smtp_server, smtp_port) as server:
#             server.starttls()
#             server.login(smtp_user, smtp_password)
#             server.send_message(msg)

#         return {"message": "Plan emailed successfully"}
#     except Exception as e:
#         logger.error(f"Error sending email: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)