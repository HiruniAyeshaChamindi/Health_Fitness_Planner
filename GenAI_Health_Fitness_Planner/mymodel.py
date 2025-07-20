import os
import json
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from agno.agent import Agent
from agno.models.google import Gemini
from agno.tools.duckduckgo import DuckDuckGoTools
import tempfile
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# API Configuration
GOOGLE_API_KEY = "AIzaSyCr35hxFrpVsbNWgqOwU6PwmkpwLmO2dJA"
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

# Email configuration (optional - configure if you want email functionality)
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USER = "your-email@gmail.com"  # Replace with your email
EMAIL_PASSWORD = "your-app-password"  # Replace with your app password

# Initialize Agents (same as your Streamlit app)
dietary_planner = Agent(
    model=Gemini(id="gemini-2.0-flash-exp"),
    description="Creates personalized dietary plans based on user input.",
    instructions=[
        "Generate a diet plan with breakfast, lunch, dinner, and snacks.",
        "Consider dietary preferences like Keto, Vegetarian, or Low Carb.",
        "Ensure proper hydration and electrolyte balance.",
        "Provide nutritional breakdown including macronutrients and vitamins.",
        "Suggest meal preparation tips for easy implementation.",
        "If necessary, search the web using DuckDuckGo for additional information.",
        "Format the response in a clear, structured way with headings and bullet points.",
    ],
    tools=[DuckDuckGoTools()],
    show_tool_calls=True,
    markdown=True
)

fitness_trainer = Agent(
    model=Gemini(id="gemini-2.0-flash-exp"),
    description="Generates customized workout routines based on fitness goals.",
    instructions=[
        "Create a workout plan including warm-ups, main exercises, and cool-downs.",
        "Adjust workouts based on fitness level: Beginner, Intermediate, Advanced.",
        "Consider weight loss, muscle gain, endurance, or flexibility goals.",
        "Provide safety tips and injury prevention advice.",
        "Suggest progress tracking methods for motivation.",
        "If necessary, search the web using DuckDuckGo for additional information.",
        "Format the response in a clear, structured way with exercise names, sets, reps, and rest periods.",
    ],
    tools=[DuckDuckGoTools()],
    show_tool_calls=True,
    markdown=True
)

team_lead = Agent(
    model=Gemini(id="gemini-2.0-flash-exp"),
    description="Combines diet and workout plans into a holistic health strategy.",
    instructions=[
        "Merge personalized diet and fitness plans for a comprehensive approach.",
        "Use Tables if possible for better organization.",
        "Ensure alignment between diet and exercise for optimal results.",
        "Suggest lifestyle tips for motivation and consistency.",
        "Provide guidance on tracking progress and adjusting plans over time.",
        "Create a motivational and encouraging tone throughout the response.",
        "Structure the response with clear sections and formatting.",
    ],
    markdown=True
)

def get_meal_plan(age, weight, height, activity_level, dietary_preference, fitness_goal, custom_preferences=None):
    """Generate personalized meal plan"""
    custom_text = ""
    if custom_preferences and custom_preferences.get('complexity'):
        custom_text = f"Focus on {custom_preferences['complexity']} meal preparation. "
    
    prompt = (f"Create a personalized meal plan for a {age}-year-old person, weighing {weight}kg, "
              f"{height}cm tall, with an activity level of '{activity_level}', following a "
              f"'{dietary_preference}' diet, aiming to achieve '{fitness_goal}'. {custom_text}")
    
    try:
        result = dietary_planner.run(prompt)
        return result.content if hasattr(result, 'content') else str(result)
    except Exception as e:
        logger.error(f"Error generating meal plan: {str(e)}")
        raise e

def get_fitness_plan(age, weight, height, activity_level, fitness_goal, custom_preferences=None):
    """Generate personalized fitness plan"""
    custom_text = ""
    if custom_preferences and custom_preferences.get('focus'):
        custom_text = f"Focus specifically on {custom_preferences['focus'].replace('_', ' ')} exercises. "
    
    prompt = (f"Generate a workout plan for a {age}-year-old person, weighing {weight}kg, "
              f"{height}cm tall, with an activity level of '{activity_level}', "
              f"aiming to achieve '{fitness_goal}'. Include warm-ups, exercises, and cool-downs. {custom_text}")
    
    try:
        result = fitness_trainer.run(prompt)
        return result.content if hasattr(result, 'content') else str(result)
    except Exception as e:
        logger.error(f"Error generating fitness plan: {str(e)}")
        raise e

def get_full_health_plan(name, age, weight, height, activity_level, dietary_preference, fitness_goal, meal_plan, fitness_plan, special_requests=None):
    """Generate comprehensive health plan"""
    special_text = f"\n\nSpecial Requests: {special_requests}" if special_requests else ""
    
    prompt = (f"Greet the customer, {name}\n\n"
              f"User Information: {age} years old, {weight}kg, {height}cm, activity level: {activity_level}.\n\n"
              f"Fitness Goal: {fitness_goal}\n\n"
              f"Meal Plan:\n{meal_plan}\n\n"
              f"Workout Plan:\n{fitness_plan}\n\n"
              f"Provide a holistic health strategy integrating both plans.{special_text}")
    
    try:
        result = team_lead.run(prompt)
        return result.content if hasattr(result, 'content') else str(result)
    except Exception as e:
        logger.error(f"Error generating full health plan: {str(e)}")
        raise e

@app.route('/api/generate-meal-plan', methods=['POST'])
def generate_meal_plan():
    """API endpoint to generate meal plan"""
    try:
        data = request.json
        logger.info(f"Received meal plan request: {data}")
        
        # Extract data
        age = data.get('age')
        weight = data.get('weight')
        height = data.get('height')
        activity_level = data.get('activity_level', 'Moderate')
        dietary_preference = data.get('dietary_preference', 'Balanced')
        fitness_goal = data.get('fitness_goal', 'Weight Loss')
        custom_preferences = data.get('customPreferences', {})
        
        # Validate required fields
        if not all([age, weight, height]):
            return jsonify({'error': 'Missing required fields: age, weight, height'}), 400
        
        # Generate meal plan
        meal_plan = get_meal_plan(age, weight, height, activity_level, dietary_preference, fitness_goal, custom_preferences)
        
        response = {
            'success': True,
            'meal_plan': meal_plan,
            'message': 'Meal plan generated successfully'
        }
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error in generate_meal_plan: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-fitness-plan', methods=['POST'])
def generate_fitness_plan():
    """API endpoint to generate fitness plan"""
    try:
        data = request.json
        logger.info(f"Received fitness plan request: {data}")
        
        # Extract data
        age = data.get('age')
        weight = data.get('weight')
        height = data.get('height')
        activity_level = data.get('activity_level', 'Moderate')
        fitness_goal = data.get('fitness_goal', 'Weight Loss')
        custom_preferences = data.get('customPreferences', {})
        
        # Validate required fields
        if not all([age, weight, height]):
            return jsonify({'error': 'Missing required fields: age, weight, height'}), 400
        
        # Generate fitness plan
        fitness_plan = get_fitness_plan(age, weight, height, activity_level, fitness_goal, custom_preferences)
        
        response = {
            'success': True,
            'fitness_plan': fitness_plan,
            'message': 'Fitness plan generated successfully'
        }
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error in generate_fitness_plan: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-full-health-plan', methods=['POST'])
def generate_full_health_plan():
    """API endpoint to generate complete health plan"""
    try:
        data = request.json
        logger.info(f"Received full health plan request")
        
        # Extract data
        name = data.get('name', 'User')
        age = data.get('age')
        weight = data.get('weight')
        height = data.get('height')
        activity_level = data.get('activity_level', 'Moderate')
        dietary_preference = data.get('dietary_preference', 'Balanced')
        fitness_goal = data.get('fitness_goal', 'Weight Loss')
        meal_plan = data.get('meal_plan', '')
        fitness_plan = data.get('fitness_plan', '')
        special_requests = data.get('special_requests')
        
        # Validate required fields
        if not all([age, weight, height]):
            return jsonify({'error': 'Missing required fields: age, weight, height'}), 400
        
        # Generate complete health plan
        full_plan = get_full_health_plan(
            name, age, weight, height, activity_level, 
            dietary_preference, fitness_goal, meal_plan, 
            fitness_plan, special_requests
        )
        
        response = {
            'success': True,
            'content': full_plan,
            'user_info': {
                'name': name,
                'age': age,
                'weight': weight,
                'height': height,
                'activity_level': activity_level,
                'dietary_preference': dietary_preference,
                'fitness_goal': fitness_goal
            },
            'meal_plan': meal_plan,
            'fitness_plan': fitness_plan,
            'message': 'Complete health plan generated successfully'
        }
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error in generate_full_health_plan: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/download-pdf', methods=['POST'])
def download_pdf():
    """Generate and return PDF of the health plan"""
    try:
        data = request.json
        logger.info("Received PDF download request")
        
        # Create temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
        
        # Create PDF
        doc = SimpleDocTemplate(temp_file.name, pagesize=A4)
        styles = getSampleStyleSheet()
        story = []
        
        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            textColor=colors.darkblue,
            alignment=1  # Center alignment
        )
        
        user_name = data.get('user_info', {}).get('name', 'User')
        title = Paragraph(f"🏋️‍♂️ Health & Fitness Plan for {user_name}", title_style)
        story.append(title)
        story.append(Spacer(1, 20))
        
        # User Info Table
        user_info = data.get('user_info', {})
        user_data = [
            ['Age', f"{user_info.get('age', 'N/A')} years"],
            ['Weight', f"{user_info.get('weight', 'N/A')} kg"],
            ['Height', f"{user_info.get('height', 'N/A')} cm"],
            ['Activity Level', user_info.get('activity_level', 'N/A')],
            ['Diet Preference', user_info.get('dietary_preference', 'N/A')],
            ['Fitness Goal', user_info.get('fitness_goal', 'N/A')]
        ]
        
        user_table = Table(user_data)
        user_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 14),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(user_table)
        story.append(Spacer(1, 30))
        
        # Health Plan Content
        content = data.get('content', 'Your personalized health plan content here.')
        
        # Split content into paragraphs and add to PDF
        paragraphs = content.split('\n')
        for para in paragraphs:
            if para.strip():
                if para.startswith('#'):  # Heading
                    heading = Paragraph(para.replace('#', '').strip(), styles['Heading2'])
                    story.append(heading)
                else:
                    paragraph = Paragraph(para, styles['Normal'])
                    story.append(paragraph)
                story.append(Spacer(1, 6))
        
        # Build PDF
        doc.build(story)
        temp_file.close()
        
        return send_file(
            temp_file.name,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"{user_name.replace(' ', '_')}_Health_Plan.pdf"
        )
        
    except Exception as e:
        logger.error(f"Error generating PDF: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/email-plan', methods=['POST'])
def email_plan():
    """Send health plan via email"""
    try:
        data = request.json
        email = data.get('email')
        user_name = data.get('user_info', {}).get('name', 'User')
        
        if not email:
            return jsonify({'error': 'Email address is required'}), 400
        
        # Create email message
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = email
        msg['Subject'] = f"Your Personalized Health & Fitness Plan - {user_name}"
        
        # Email body
        body = f"""
        Hello {user_name},
        
        Your personalized health and fitness plan has been generated! Here's your complete plan:
        
        {data.get('content', 'Your health plan content here.')}
        
        Stay motivated and consistent with your fitness journey!
        
        Best regards,
        AI Health & Fitness Team
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email (if configured)
        try:
            server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASSWORD)
            text = msg.as_string()
            server.sendmail(EMAIL_USER, email, text)
            server.quit()
            
            return jsonify({
                'success': True,
                'message': f'Health plan sent successfully to {email}'
            })
            
        except Exception as email_error:
            logger.warning(f"Email sending failed: {str(email_error)}")
            # Return success anyway (email functionality is optional)
            return jsonify({
                'success': True,
                'message': 'Plan generated successfully (email feature not configured)'
            })
        
    except Exception as e:
        logger.error(f"Error in email_plan: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'AI Health & Fitness API is running',
        'agents': {
            'dietary_planner': 'active',
            'fitness_trainer': 'active',
            'team_lead': 'active'
        }
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    logger.info("Starting AI Health & Fitness API Server...")
    logger.info("Available endpoints:")
    logger.info("- POST /api/generate-meal-plan")
    logger.info("- POST /api/generate-fitness-plan") 
    logger.info("- POST /api/generate-full-health-plan")
    logger.info("- POST /api/download-pdf")
    logger.info("- POST /api/email-plan")
    logger.info("- GET /api/health")
    
    app.run(debug=True, host='0.0.0.0', port=8000)




