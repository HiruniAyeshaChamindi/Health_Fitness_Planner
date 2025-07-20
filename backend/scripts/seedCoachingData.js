const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("dotenv").config()

// Import models
const User = require("../models/User")
const Coach = require("../models/Coach")
const CoachRequest = require("../models/CoachRequest")
const ChatMessage = require("../models/ChatMessage")
const CoachReview = require("../models/CoachReview")
const CoachPlan = require("../models/CoachPlan")

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const seedData = async () => {
  try {
    console.log("🌱 Starting to seed coaching data...")

    // Clear existing data
    await User.deleteMany({ role: { $in: ["coach", "user"] } })
    await Coach.deleteMany({})
    await CoachRequest.deleteMany({})
    await ChatMessage.deleteMany({})
    await CoachReview.deleteMany({})
    await CoachPlan.deleteMany({})

    console.log("🗑️  Cleared existing data")

    // Create Users (both regular users and coaches)
    const hashedPassword = await bcrypt.hash("password123", 10)

    const users = await User.insertMany([
      // Regular Users
      {
        name: "John Smith",
        email: "john.smith@example.com",
        password: hashedPassword,
        role: "user",
        age: 28,
        gender: "male",
        fitnessLevel: "intermediate",
        goals: ["weight_loss", "muscle_gain"],
      },
      {
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        password: hashedPassword,
        role: "user",
        age: 32,
        gender: "female",
        fitnessLevel: "beginner",
        goals: ["weight_loss", "general_fitness"],
      },
      {
        name: "Mike Chen",
        email: "mike.chen@example.com",
        password: hashedPassword,
        role: "user",
        age: 25,
        gender: "male",
        fitnessLevel: "advanced",
        goals: ["muscle_gain", "strength"],
      },
      {
        name: "Emily Davis",
        email: "emily.davis@example.com",
        password: hashedPassword,
        role: "user",
        age: 29,
        gender: "female",
        fitnessLevel: "intermediate",
        goals: ["flexibility", "stress_relief"],
      },
      {
        name: "David Wilson",
        email: "david.wilson@example.com",
        password: hashedPassword,
        role: "user",
        age: 35,
        gender: "male",
        fitnessLevel: "beginner",
        goals: ["weight_loss", "cardiovascular_health"],
      },

      // Coach Users
      {
        name: "Alex Rodriguez",
        email: "alex.rodriguez@example.com",
        password: hashedPassword,
        role: "coach",
        age: 30,
        gender: "male",
      },
      {
        name: "Maria Garcia",
        email: "maria.garcia@example.com",
        password: hashedPassword,
        role: "coach",
        age: 28,
        gender: "female",
      },
      {
        name: "James Thompson",
        email: "james.thompson@example.com",
        password: hashedPassword,
        role: "coach",
        age: 35,
        gender: "male",
      },
      {
        name: "Lisa Anderson",
        email: "lisa.anderson@example.com",
        password: hashedPassword,
        role: "coach",
        age: 31,
        gender: "female",
      },
      {
        name: "Robert Kim",
        email: "robert.kim@example.com",
        password: hashedPassword,
        role: "coach",
        age: 33,
        gender: "male",
      },
      {
        name: "Jennifer Martinez",
        email: "jennifer.martinez@example.com",
        password: hashedPassword,
        role: "coach",
        age: 27,
        gender: "female",
      },
      {
        name: "Michael Brown",
        email: "michael.brown@example.com",
        password: hashedPassword,
        role: "coach",
        age: 29,
        gender: "male",
      },
      {
        name: "Amanda Taylor",
        email: "amanda.taylor@example.com",
        password: hashedPassword,
        role: "coach",
        age: 26,
        gender: "female",
      },
    ])

    console.log("👥 Created users")

    // Separate regular users and coach users
    const regularUsers = users.slice(0, 5)
    const coachUsers = users.slice(5)

    // Create Coach Profiles
    const coaches = await Coach.insertMany([
      {
        userId: coachUsers[0]._id, // Alex Rodriguez
        name: "Alex Rodriguez",
        bio: "Certified personal trainer with 8 years of experience specializing in weight loss and strength training. I believe in creating sustainable fitness habits that fit into your lifestyle. My approach combines evidence-based training methods with personalized nutrition guidance.",
        specialties: ["Weight Loss", "Strength Training", "Nutrition"],
        certifications: ["NASM Certified Personal Trainer", "Precision Nutrition Level 1", "TRX Suspension Training"],
        experienceYears: 8,
        languages: ["English", "Spanish"],
        availability: [
          {
            day: "Monday",
            timeSlots: [
              { start: "06:00", end: "10:00" },
              { start: "18:00", end: "21:00" },
            ],
          },
          {
            day: "Wednesday",
            timeSlots: [
              { start: "06:00", end: "10:00" },
              { start: "18:00", end: "21:00" },
            ],
          },
          {
            day: "Friday",
            timeSlots: [
              { start: "06:00", end: "10:00" },
              { start: "18:00", end: "21:00" },
            ],
          },
          { day: "Saturday", timeSlots: [{ start: "08:00", end: "16:00" }] },
        ],
        profilePic: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face",
        verified: true,
        rating: 4.8,
        totalReviews: 47,
        pricing: { sessionRate: 75, monthlyRate: 280, currency: "USD" },
        isActive: true,
      },
      {
        userId: coachUsers[1]._id, // Maria Garcia
        name: "Maria Garcia",
        bio: "Yoga instructor and wellness coach passionate about helping women find balance in their lives. I specialize in yoga, meditation, and holistic wellness approaches. My classes focus on building strength, flexibility, and inner peace.",
        specialties: ["Yoga", "Mental Health", "Nutrition"],
        certifications: ["RYT 500 Yoga Alliance", "Certified Wellness Coach", "Mindfulness-Based Stress Reduction"],
        experienceYears: 6,
        languages: ["English", "Spanish", "Portuguese"],
        availability: [
          {
            day: "Tuesday",
            timeSlots: [
              { start: "07:00", end: "11:00" },
              { start: "17:00", end: "20:00" },
            ],
          },
          {
            day: "Thursday",
            timeSlots: [
              { start: "07:00", end: "11:00" },
              { start: "17:00", end: "20:00" },
            ],
          },
          { day: "Saturday", timeSlots: [{ start: "09:00", end: "15:00" }] },
          { day: "Sunday", timeSlots: [{ start: "09:00", end: "13:00" }] },
        ],
        profilePic: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
        verified: true,
        rating: 4.9,
        totalReviews: 63,
        pricing: { sessionRate: 60, monthlyRate: 220, currency: "USD" },
        isActive: true,
      },
      {
        userId: coachUsers[2]._id, // James Thompson
        name: "James Thompson",
        bio: "Former professional athlete turned fitness coach. I specialize in high-performance training, sports conditioning, and injury rehabilitation. Whether you're an athlete or just want to train like one, I'll help you reach your peak performance.",
        specialties: ["Strength Training", "Cardio", "Rehabilitation"],
        certifications: [
          "CSCS Certified Strength & Conditioning Specialist",
          "ACSM Exercise Physiologist",
          "FMS Functional Movement Screen",
        ],
        experienceYears: 12,
        languages: ["English"],
        availability: [
          {
            day: "Monday",
            timeSlots: [
              { start: "05:00", end: "09:00" },
              { start: "16:00", end: "20:00" },
            ],
          },
          {
            day: "Tuesday",
            timeSlots: [
              { start: "05:00", end: "09:00" },
              { start: "16:00", end: "20:00" },
            ],
          },
          {
            day: "Thursday",
            timeSlots: [
              { start: "05:00", end: "09:00" },
              { start: "16:00", end: "20:00" },
            ],
          },
          {
            day: "Friday",
            timeSlots: [
              { start: "05:00", end: "09:00" },
              { start: "16:00", end: "20:00" },
            ],
          },
        ],
        profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        verified: true,
        rating: 4.7,
        totalReviews: 89,
        pricing: { sessionRate: 90, monthlyRate: 350, currency: "USD" },
        isActive: true,
      },
      {
        userId: coachUsers[3]._id, // Lisa Anderson
        name: "Lisa Anderson",
        bio: "Registered dietitian and fitness coach specializing in sustainable weight management and healthy lifestyle changes. I help busy professionals create realistic fitness and nutrition plans that work with their hectic schedules.",
        specialties: ["Weight Loss", "Nutrition", "Cardio"],
        certifications: [
          "Registered Dietitian Nutritionist",
          "ACE Certified Personal Trainer",
          "Behavior Change Specialist",
        ],
        experienceYears: 9,
        languages: ["English", "French"],
        availability: [
          { day: "Monday", timeSlots: [{ start: "12:00", end: "18:00" }] },
          { day: "Wednesday", timeSlots: [{ start: "12:00", end: "18:00" }] },
          { day: "Friday", timeSlots: [{ start: "12:00", end: "18:00" }] },
          { day: "Sunday", timeSlots: [{ start: "10:00", end: "16:00" }] },
        ],
        profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
        verified: true,
        rating: 4.6,
        totalReviews: 34,
        pricing: { sessionRate: 80, monthlyRate: 300, currency: "USD" },
        isActive: true,
      },
      {
        userId: coachUsers[4]._id, // Robert Kim
        name: "Robert Kim",
        bio: "Martial arts instructor and functional fitness expert. I combine traditional martial arts training with modern fitness techniques to build strength, flexibility, and mental discipline. Perfect for those looking for a unique and challenging workout experience.",
        specialties: ["Strength Training", "Cardio", "Mental Health"],
        certifications: ["Black Belt Taekwondo", "Kettlebell Instructor", "CrossFit Level 2 Trainer"],
        experienceYears: 15,
        languages: ["English", "Korean", "Chinese"],
        availability: [
          {
            day: "Tuesday",
            timeSlots: [
              { start: "06:00", end: "10:00" },
              { start: "19:00", end: "22:00" },
            ],
          },
          {
            day: "Thursday",
            timeSlots: [
              { start: "06:00", end: "10:00" },
              { start: "19:00", end: "22:00" },
            ],
          },
          { day: "Saturday", timeSlots: [{ start: "07:00", end: "17:00" }] },
        ],
        profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        verified: true,
        rating: 4.5,
        totalReviews: 28,
        pricing: { sessionRate: 70, monthlyRate: 260, currency: "USD" },
        isActive: true,
      },
      {
        userId: coachUsers[5]._id, // Jennifer Martinez
        name: "Jennifer Martinez",
        bio: "Prenatal and postnatal fitness specialist helping mothers stay active and healthy throughout their journey. I understand the unique challenges women face and create safe, effective programs for every stage of motherhood.",
        specialties: ["Weight Loss", "Yoga", "Rehabilitation"],
        certifications: [
          "Pre/Postnatal Exercise Specialist",
          "Yoga Alliance RYT 200",
          "Corrective Exercise Specialist",
        ],
        experienceYears: 7,
        languages: ["English", "Spanish"],
        availability: [
          { day: "Monday", timeSlots: [{ start: "09:00", end: "15:00" }] },
          { day: "Wednesday", timeSlots: [{ start: "09:00", end: "15:00" }] },
          { day: "Friday", timeSlots: [{ start: "09:00", end: "15:00" }] },
        ],
        profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
        verified: true,
        rating: 4.9,
        totalReviews: 52,
        pricing: { sessionRate: 65, monthlyRate: 240, currency: "USD" },
        isActive: true,
      },
      {
        userId: coachUsers[6]._id, // Michael Brown
        name: "Michael Brown",
        bio: "Senior fitness coach specializing in training for adults 50+. I focus on functional movement, balance, and maintaining independence through strength training. My programs are designed to help you feel young and strong at any age.",
        specialties: ["Strength Training", "Rehabilitation", "Cardio"],
        certifications: ["Senior Fitness Specialist", "Medical Exercise Specialist", "Balance Training Certification"],
        experienceYears: 11,
        languages: ["English"],
        availability: [
          { day: "Monday", timeSlots: [{ start: "08:00", end: "16:00" }] },
          { day: "Tuesday", timeSlots: [{ start: "08:00", end: "16:00" }] },
          { day: "Thursday", timeSlots: [{ start: "08:00", end: "16:00" }] },
          { day: "Friday", timeSlots: [{ start: "08:00", end: "16:00" }] },
        ],
        profilePic: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
        verified: false,
        rating: 4.4,
        totalReviews: 19,
        pricing: { sessionRate: 55, monthlyRate: 200, currency: "USD" },
        isActive: true,
      },
      {
        userId: coachUsers[7]._id, // Amanda Taylor
        name: "Amanda Taylor",
        bio: "Dance fitness instructor and body positivity advocate. I believe fitness should be fun and inclusive for everyone. My classes combine dance, cardio, and strength training in a supportive, judgment-free environment.",
        specialties: ["Cardio", "Weight Loss", "Mental Health"],
        certifications: ["Zumba Instructor", "Barre Certification", "Group Fitness Instructor"],
        experienceYears: 4,
        languages: ["English"],
        availability: [
          { day: "Monday", timeSlots: [{ start: "17:00", end: "21:00" }] },
          { day: "Wednesday", timeSlots: [{ start: "17:00", end: "21:00" }] },
          { day: "Saturday", timeSlots: [{ start: "10:00", end: "18:00" }] },
          { day: "Sunday", timeSlots: [{ start: "10:00", end: "16:00" }] },
        ],
        profilePic: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
        verified: false,
        rating: 4.7,
        totalReviews: 15,
        pricing: { sessionRate: 50, monthlyRate: 180, currency: "USD" },
        isActive: true,
      },
    ])

    console.log("🏋️ Created coach profiles")

    // Create Coaching Requests
    const requests = await CoachRequest.insertMany([
      {
        userId: regularUsers[0]._id, // John Smith
        coachId: coaches[0]._id, // Alex Rodriguez
        message:
          "Hi Alex! I'm looking to lose about 20 pounds and build some muscle. I work a desk job and haven't been active in a while. I can work out 3-4 times per week, preferably in the evenings. I'd love to learn proper form and get a structured plan that I can stick to long-term.",
        goals: ["Weight Loss", "Muscle Gain", "General Fitness"],
        preferredSchedule: "Weekday evenings after 6 PM, weekends flexible",
        planType: "monthly",
        status: "accepted",
        responseMessage:
          "Hi John! I'd be happy to help you reach your goals. Your timeline and availability work perfectly with my schedule. Let's start with a comprehensive assessment and build a sustainable program that fits your lifestyle.",
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-04-15"),
      },
      {
        userId: regularUsers[1]._id, // Sarah Johnson
        coachId: coaches[1]._id, // Maria Garcia
        message:
          "Hello Maria! I'm new to fitness and feeling overwhelmed by all the information out there. I'm interested in yoga and mindfulness practices to help with stress management. I work from home and have flexibility during the day. Looking for gentle guidance to start my wellness journey.",
        goals: ["Stress Management", "Flexibility", "Mental Health"],
        preferredSchedule: "Flexible during weekdays, prefer morning sessions",
        planType: "monthly",
        status: "accepted",
        responseMessage:
          "Hi Sarah! Welcome to your wellness journey! I specialize in exactly what you're looking for. Let's start with gentle yoga and mindfulness practices that will help you build confidence and reduce stress. I'm excited to work with you!",
        startDate: new Date("2024-01-20"),
        endDate: new Date("2024-04-20"),
      },
      {
        userId: regularUsers[2]._id, // Mike Chen
        coachId: coaches[2]._id, // James Thompson
        message:
          "James, I'm training for a marathon and want to improve my overall athletic performance. I have experience with running but want to add strength training and cross-training to prevent injuries and boost performance. Available early mornings before work.",
        goals: ["Athletic Performance", "Injury Prevention", "Strength Training"],
        preferredSchedule: "Early mornings 5-7 AM, Monday through Friday",
        planType: "monthly",
        status: "pending",
        responseMessage: null,
      },
      {
        userId: regularUsers[3]._id, // Emily Davis
        coachId: coaches[3]._id, // Lisa Anderson
        message:
          "Hi Lisa! I'm a busy mom of two and struggling to find time for myself. I want to lose the baby weight and feel more energetic. I can only work out during lunch breaks or after kids go to bed. Need help with both exercise and nutrition planning.",
        goals: ["Weight Loss", "Energy Boost", "Nutrition Guidance"],
        preferredSchedule: "Lunch breaks 12-1 PM or evenings after 8 PM",
        planType: "monthly",
        status: "accepted",
        responseMessage:
          "Hi Emily! I completely understand the challenges of being a busy mom. I specialize in helping women in your situation. We'll create efficient workouts and practical nutrition strategies that fit into your schedule. You've got this!",
        startDate: new Date("2024-01-25"),
        endDate: new Date("2024-04-25"),
      },
      {
        userId: regularUsers[4]._id, // David Wilson
        coachId: coaches[4]._id, // Robert Kim
        message:
          "Robert, I'm 35 and want to get back in shape after years of being sedentary. I'm interested in martial arts and functional fitness. I have some old knee injuries, so I need someone who understands modifications and safe progression.",
        goals: ["General Fitness", "Functional Movement", "Injury Recovery"],
        preferredSchedule: "Evenings and weekends",
        planType: "weekly",
        status: "rejected",
        responseMessage:
          "Hi David, thank you for your interest. Unfortunately, I'm currently at capacity with my client load. I'd recommend checking back in a few months or exploring other qualified trainers who specialize in injury modification.",
      },
      {
        userId: regularUsers[0]._id, // John Smith (second request)
        coachId: coaches[5]._id, // Jennifer Martinez
        message:
          "Hi Jennifer! My wife is pregnant and I want to find a coach who can help her stay active safely. She's in her second trimester and was moderately active before pregnancy. Looking for someone with prenatal expertise.",
        goals: ["Prenatal Fitness", "Safe Exercise", "Preparation for Birth"],
        preferredSchedule: "Flexible, prefer daytime sessions",
        planType: "session",
        status: "pending",
        responseMessage: null,
      },
    ])

    console.log("📝 Created coaching requests")

    // Create Chat Messages for accepted requests
    const acceptedRequests = requests.filter((req) => req.status === "accepted")

    const chatMessages = []

    // Messages for John Smith & Alex Rodriguez
    chatMessages.push(
      {
        fromUserId: regularUsers[0]._id,
        toUserId: coachUsers[0]._id,
        requestId: acceptedRequests[0]._id,
        message:
          "Thanks for accepting my request! I'm really excited to get started. When would be a good time for our first session?",
        messageType: "text",
        read: true,
        readAt: new Date("2024-01-16T10:30:00Z"),
        createdAt: new Date("2024-01-16T10:00:00Z"),
      },
      {
        fromUserId: coachUsers[0]._id,
        toUserId: regularUsers[0]._id,
        requestId: acceptedRequests[0]._id,
        message:
          "Great to have you on board, John! How about we start with a fitness assessment this Friday at 7 PM? I'll send you a form to fill out beforehand so we can make the most of our time.",
        messageType: "text",
        read: true,
        readAt: new Date("2024-01-16T11:00:00Z"),
        createdAt: new Date("2024-01-16T10:45:00Z"),
      },
      {
        fromUserId: regularUsers[0]._id,
        toUserId: coachUsers[0]._id,
        requestId: acceptedRequests[0]._id,
        message: "Friday at 7 PM works perfectly! Should I bring anything specific to the assessment?",
        messageType: "text",
        read: true,
        readAt: new Date("2024-01-16T11:15:00Z"),
        createdAt: new Date("2024-01-16T11:10:00Z"),
      },
      {
        fromUserId: coachUsers[0]._id,
        toUserId: regularUsers[0]._id,
        requestId: acceptedRequests[0]._id,
        message:
          "Just bring comfortable workout clothes, a water bottle, and a positive attitude! I'll have all the equipment we need. Looking forward to it!",
        messageType: "text",
        read: false,
        createdAt: new Date("2024-01-16T11:20:00Z"),
      },
    )

    // Messages for Sarah Johnson & Maria Garcia
    chatMessages.push(
      {
        fromUserId: coachUsers[1]._id,
        toUserId: regularUsers[1]._id,
        requestId: acceptedRequests[1]._id,
        message:
          "Welcome Sarah! I'm so glad you're starting this journey. Let's begin with a gentle introduction to yoga. Are you completely new to yoga or have you tried it before?",
        messageType: "text",
        read: true,
        readAt: new Date("2024-01-21T09:00:00Z"),
        createdAt: new Date("2024-01-21T08:30:00Z"),
      },
      {
        fromUserId: regularUsers[1]._id,
        toUserId: coachUsers[1]._id,
        requestId: acceptedRequests[1]._id,
        message:
          "Thank you Maria! I've tried a few YouTube videos but nothing consistent. I'm definitely a beginner and sometimes feel intimidated by all the poses I see online.",
        messageType: "text",
        read: true,
        readAt: new Date("2024-01-21T09:15:00Z"),
        createdAt: new Date("2024-01-21T09:10:00Z"),
      },
      {
        fromUserId: coachUsers[1]._id,
        toUserId: regularUsers[1]._id,
        requestId: acceptedRequests[1]._id,
        message:
          "That's completely normal! We'll start with basic poses and breathing techniques. Remember, yoga is about your personal journey, not comparing yourself to others. How about we schedule our first session for Tuesday morning at 9 AM?",
        messageType: "text",
        read: false,
        createdAt: new Date("2024-01-21T09:25:00Z"),
      },
    )

    // Messages for Emily Davis & Lisa Anderson
    chatMessages.push(
      {
        fromUserId: regularUsers[3]._id,
        toUserId: coachUsers[3]._id,
        requestId: acceptedRequests[2]._id,
        message:
          "Lisa, thank you so much for understanding my situation! It's been really hard to prioritize myself lately. How do we get started?",
        messageType: "text",
        read: true,
        readAt: new Date("2024-01-26T13:00:00Z"),
        createdAt: new Date("2024-01-26T12:30:00Z"),
      },
      {
        fromUserId: coachUsers[3]._id,
        toUserId: regularUsers[3]._id,
        requestId: acceptedRequests[2]._id,
        message:
          "Emily, you're taking the first step by reaching out - that's huge! Let's start with a nutrition consultation. I'll send you a food diary to track for a few days, then we'll design quick, effective workouts that fit your schedule. When works better for you - lunch break or evening?",
        messageType: "text",
        read: true,
        readAt: new Date("2024-01-26T13:30:00Z"),
        createdAt: new Date("2024-01-26T13:15:00Z"),
      },
      {
        fromUserId: regularUsers[3]._id,
        toUserId: coachUsers[3]._id,
        requestId: acceptedRequests[2]._id,
        message:
          "Lunch breaks are more reliable for me. The kids' schedules are so unpredictable in the evenings. I'll start tracking my food today!",
        messageType: "text",
        read: false,
        createdAt: new Date("2024-01-26T13:45:00Z"),
      },
    )

    await ChatMessage.insertMany(chatMessages)
    console.log("💬 Created chat messages")

    // Create Reviews
    const reviews = await CoachReview.insertMany([
      {
        userId: regularUsers[0]._id,
        coachId: coaches[0]._id,
        requestId: acceptedRequests[0]._id,
        rating: 5,
        reviewText:
          "Alex is an amazing trainer! He helped me lose 15 pounds in 3 months while building muscle. His approach is professional yet encouraging, and he really knows how to modify exercises for different fitness levels. Highly recommend!",
        categories: {
          communication: 5,
          expertise: 5,
          punctuality: 5,
          results: 5,
        },
      },
      {
        userId: regularUsers[1]._id,
        coachId: coaches[1]._id,
        requestId: acceptedRequests[1]._id,
        rating: 5,
        reviewText:
          "Maria has been life-changing for me. As someone who was completely new to yoga and wellness practices, she made me feel comfortable and supported every step of the way. My stress levels have decreased significantly, and I actually look forward to our sessions!",
        categories: {
          communication: 5,
          expertise: 5,
          punctuality: 5,
          results: 5,
        },
      },
      {
        userId: regularUsers[3]._id,
        coachId: coaches[3]._id,
        requestId: acceptedRequests[2]._id,
        rating: 4,
        reviewText:
          "Lisa understands the challenges of being a busy mom. She created realistic meal plans and quick workouts that actually fit into my crazy schedule. I've lost 8 pounds and have so much more energy. Only reason it's not 5 stars is that I wish we could meet more frequently, but that's my schedule, not her fault!",
        categories: {
          communication: 5,
          expertise: 4,
          punctuality: 5,
          results: 4,
        },
      },
      // Additional reviews for other coaches to boost their ratings
      {
        userId: regularUsers[2]._id,
        coachId: coaches[2]._id,
        requestId: new mongoose.Types.ObjectId(), // Dummy request ID
        rating: 5,
        reviewText:
          "James pushed me to new levels I didn't think were possible. His athletic background really shows in his training methods. Excellent for anyone serious about performance.",
        categories: {
          communication: 4,
          expertise: 5,
          punctuality: 5,
          results: 5,
        },
      },
      {
        userId: regularUsers[4]._id,
        coachId: coaches[4]._id,
        requestId: new mongoose.Types.ObjectId(), // Dummy request ID
        rating: 4,
        reviewText:
          "Robert's martial arts approach to fitness is unique and challenging. Great for building functional strength and mental discipline.",
        categories: {
          communication: 4,
          expertise: 5,
          punctuality: 4,
          results: 4,
        },
      },
    ])

    console.log("⭐ Created reviews")

    // Create Sample Workout Plans
    const workoutPlans = await CoachPlan.insertMany([
      {
        coachId: coaches[0]._id,
        userId: regularUsers[0]._id,
        requestId: acceptedRequests[0]._id,
        planType: "workout",
        title: "Beginner Strength & Weight Loss Program",
        description:
          "A comprehensive 4-week program designed to build strength while promoting fat loss. Perfect for beginners returning to fitness.",
        workoutPlan: {
          exercises: [
            {
              name: "Bodyweight Squats",
              sets: 3,
              reps: "12-15",
              weight: "Bodyweight",
              duration: null,
              notes: "Focus on proper form, keep chest up and knees tracking over toes",
            },
            {
              name: "Push-ups (Modified if needed)",
              sets: 3,
              reps: "8-12",
              weight: "Bodyweight",
              duration: null,
              notes: "Start with knee push-ups if needed, progress to full push-ups",
            },
            {
              name: "Plank Hold",
              sets: 3,
              reps: null,
              weight: "Bodyweight",
              duration: "30-60 seconds",
              notes: "Keep core tight, straight line from head to heels",
            },
            {
              name: "Dumbbell Rows",
              sets: 3,
              reps: "10-12",
              weight: "15-20 lbs",
              duration: null,
              notes: "Use bench for support, squeeze shoulder blades together",
            },
            {
              name: "Walking/Jogging",
              sets: 1,
              reps: null,
              weight: null,
              duration: "20-30 minutes",
              notes: "Moderate pace, should be able to hold a conversation",
            },
          ],
          duration: "45-60 minutes",
          frequency: "3 times per week (Mon, Wed, Fri)",
        },
        goals: ["Weight Loss", "Muscle Gain", "General Fitness"],
        duration: "4 weeks",
        status: "active",
        feedback: [
          {
            date: new Date("2024-01-20"),
            message:
              "Great job on your first week! Your form is improving already. Let's increase the plank hold time next week.",
            type: "encouragement",
          },
        ],
      },
      {
        coachId: coaches[1]._id,
        userId: regularUsers[1]._id,
        requestId: acceptedRequests[1]._id,
        planType: "combined",
        title: "Mindful Movement & Wellness Plan",
        description:
          "A holistic approach combining gentle yoga, mindfulness practices, and nutritional guidance for stress reduction and overall wellness.",
        workoutPlan: {
          exercises: [
            {
              name: "Sun Salutation A",
              sets: 3,
              reps: "5 rounds",
              weight: null,
              duration: "10 minutes",
              notes: "Move slowly with breath, modify as needed",
            },
            {
              name: "Warrior II Flow",
              sets: 2,
              reps: "Hold each side",
              weight: null,
              duration: "1 minute each side",
              notes: "Focus on grounding through feet, strong legs",
            },
            {
              name: "Seated Meditation",
              sets: 1,
              reps: null,
              weight: null,
              duration: "10-15 minutes",
              notes: "Focus on breath awareness, use guided meditation if helpful",
            },
            {
              name: "Gentle Stretching Sequence",
              sets: 1,
              reps: null,
              weight: null,
              duration: "15 minutes",
              notes: "Hold each stretch for 30-60 seconds, breathe deeply",
            },
          ],
          duration: "45 minutes",
          frequency: "4 times per week",
        },
        mealPlan: {
          meals: [
            {
              type: "breakfast",
              name: "Mindful Morning Bowl",
              ingredients: ["Oatmeal", "Berries", "Almonds", "Honey", "Cinnamon"],
              calories: 350,
              macros: { protein: 12, carbs: 55, fat: 12 },
              instructions: "Prepare oatmeal mindfully, add toppings with intention",
            },
            {
              type: "lunch",
              name: "Nourishing Buddha Bowl",
              ingredients: ["Quinoa", "Roasted vegetables", "Chickpeas", "Avocado", "Tahini dressing"],
              calories: 450,
              macros: { protein: 18, carbs: 52, fat: 18 },
              instructions: "Combine ingredients in a bowl, eat slowly and mindfully",
            },
          ],
          dailyCalories: 1800,
          notes: "Focus on eating mindfully, chewing slowly, and appreciating your food",
        },
        goals: ["Stress Management", "Flexibility", "Mental Health"],
        duration: "6 weeks",
        status: "active",
        feedback: [
          {
            date: new Date("2024-01-25"),
            message:
              "Your mindfulness practice is developing beautifully. I can see you're more present in our sessions.",
            type: "encouragement",
          },
        ],
      },
    ])

    console.log("📋 Created workout plans")

    console.log("✅ Database seeded successfully!")
    console.log("\n📊 Summary:")
    console.log(`👥 Users created: ${users.length}`)
    console.log(`🏋️ Coaches created: ${coaches.length}`)
    console.log(`📝 Requests created: ${requests.length}`)
    console.log(`💬 Messages created: ${chatMessages.length}`)
    console.log(`⭐ Reviews created: ${reviews.length}`)
    console.log(`📋 Plans created: ${workoutPlans.length}`)

    console.log("\n🔐 Login Credentials:")
    console.log("Regular Users:")
    console.log("- john.smith@example.com / password123")
    console.log("- sarah.johnson@example.com / password123")
    console.log("- mike.chen@example.com / password123")
    console.log("- emily.davis@example.com / password123")
    console.log("- david.wilson@example.com / password123")
    console.log("\nCoaches:")
    console.log("- alex.rodriguez@example.com / password123")
    console.log("- maria.garcia@example.com / password123")
    console.log("- james.thompson@example.com / password123")
    console.log("- lisa.anderson@example.com / password123")
    console.log("- robert.kim@example.com / password123")
    console.log("- jennifer.martinez@example.com / password123")
    console.log("- michael.brown@example.com / password123")
    console.log("- amanda.taylor@example.com / password123")
  } catch (error) {
    console.error("❌ Error seeding data:", error)
  } finally {
    mongoose.connection.close()
  }
}

// Run the seed function
seedData()
