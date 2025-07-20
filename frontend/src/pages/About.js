import React from 'react';
import { Target, Users, Award, Heart, Zap, Shield } from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Founder & Chief Medical Officer",
      image: "/images/image1.jpeg",
      bio: "Board-certified physician with 15+ years of experience in sports medicine and fitness."
    },
    {
      name: "Mike Chen",
      role: "Head of Fitness Programs",
      image: "/images/image2.jpeg",
      bio: "Certified personal trainer and former professional athlete with expertise in strength training."
    },
    {
      name: "Lisa Rodriguez",
      role: "Lead Nutritionist",
      image: "/images/image3.jpeg",
      bio: "Registered dietitian specializing in sports nutrition and metabolic health."
    },
    {
      name: "David Thompson",
      role: "Technology Director",
      image: "/images/image4.jpeg",
      bio: "Software engineer passionate about using AI to make fitness accessible to everyone."
    }
  ];

  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Personalized Approach",
      description: "Every fitness journey is unique. We create personalized plans that adapt to your goals, preferences, and lifestyle."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Health First",
      description: "Your health and safety are our top priorities. All our programs are designed with medical expertise and evidence-based practices."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "AI-Powered Intelligence",
      description: "Leveraging cutting-edge AI technology to provide intelligent recommendations and adaptive workout plans."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Support",
      description: "Building a supportive community where everyone can share their journey and celebrate achievements together."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Proven Results",
      description: "Our methods are backed by scientific research and proven to deliver sustainable, long-term results."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Privacy & Security",
      description: "Your personal data and health information are protected with enterprise-level security measures."
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "1M+", label: "Workouts Completed" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "AI Support" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About FitGenie</h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
            Empowering your fitness journey with AI-powered personalization and expert guidance.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At FitGenie, we believe that fitness should be accessible, personalized, and sustainable for everyone. 
                Our mission is to democratize health and wellness by combining cutting-edge artificial intelligence 
                with expert knowledge from certified fitness professionals and medical practitioners.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We understand that every person's fitness journey is unique, which is why we've created an intelligent 
                platform that adapts to your individual needs, preferences, and goals. Whether you're a beginner 
                taking your first steps towards a healthier lifestyle or an experienced athlete looking to optimize 
                your performance, FitGenie is here to guide you every step of the way.
              </p>
              <p className="text-lg text-gray-600">
                Our vision is a world where everyone has access to personalized, science-backed fitness guidance 
                that fits their lifestyle and helps them achieve lasting results.
              </p>
            </div>
            <div className="lg:pl-12">
              <img
                src="/images/image1.jpeg"
                alt="Our Mission"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do and drive us to create the best fitness experience for our users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-primary-600 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our diverse team of experts brings together medical knowledge, fitness expertise, and cutting-edge technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-sm text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Powered by Advanced AI</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our proprietary AI engine analyzes thousands of data points to create personalized workout plans 
                that evolve with your progress. Using machine learning algorithms, we continuously optimize your 
                fitness program based on your performance, preferences, and goals.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Real-time adaptation based on your performance</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Evidence-based exercise recommendations</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Intelligent progression and recovery management</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">24/7 AI assistant for guidance and motivation</p>
                </div>
              </div>
            </div>
            <div className="lg:order-1">
              <img
                src="/images/image2.jpeg"
                alt="AI Technology"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their lives with FitGenie's personalized fitness approach.
          </p>
          <div className="space-x-4">
            <button className="bg-white text-primary-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">
              Get Started Free
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-primary-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
