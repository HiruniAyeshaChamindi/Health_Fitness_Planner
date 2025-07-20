import React from 'react';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Exercises for Building Core Strength",
      excerpt: "Discover the most effective core exercises that will help you build a strong foundation for all your fitness activities.",
      author: "Dr. Sarah Johnson",
      date: "March 15, 2024",
      readTime: "5 min read",
      category: "Strength Training",
      image: "/images/image1.jpeg",
      featured: true
    },
    {
      id: 2,
      title: "The Science Behind HIIT Training",
      excerpt: "Learn why High-Intensity Interval Training is so effective and how to incorporate it into your fitness routine.",
      author: "Mike Chen",
      date: "March 12, 2024",
      readTime: "7 min read",
      category: "Cardio",
      image: "/images/image2.jpeg"
    },
    {
      id: 3,
      title: "Nutrition Tips for Optimal Recovery",
      excerpt: "What you eat after your workout is crucial for recovery. Here's what you need to know about post-workout nutrition.",
      author: "Lisa Rodriguez",
      date: "March 10, 2024",
      readTime: "6 min read",
      category: "Nutrition",
      image: "/images/image3.jpeg"
    },
    {
      id: 4,
      title: "Building Healthy Habits That Stick",
      excerpt: "Creating lasting change requires the right approach. Learn how to build sustainable fitness habits.",
      author: "David Thompson",
      date: "March 8, 2024",
      readTime: "4 min read",
      category: "Motivation",
      image: "/images/image4.jpeg"
    },
    {
      id: 5,
      title: "Home Workout Equipment on a Budget",
      excerpt: "You don't need expensive equipment to get a great workout at home. Here are budget-friendly options that work.",
      author: "Emma Wilson",
      date: "March 5, 2024",
      readTime: "5 min read",
      category: "Equipment",
      image: "/images/image1.jpeg"
    },
    {
      id: 6,
      title: "The Importance of Rest Days",
      excerpt: "Rest and recovery are just as important as your workouts. Learn why rest days are essential for progress.",
      author: "Dr. Sarah Johnson",
      date: "March 3, 2024",
      readTime: "3 min read",
      category: "Recovery",
      image: "/images/image2.jpeg"
    }
  ];

  const categories = ["All", "Strength Training", "Cardio", "Nutrition", "Motivation", "Equipment", "Recovery"];
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">FitGenie Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert insights, tips, and guidance to help you achieve your fitness goals.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="h-64 md:h-full w-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center space-x-2 text-sm text-primary-600 mb-2">
                    <span className="bg-primary-100 px-3 py-1 rounded-full">Featured</span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full">{featuredPost.category}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{featuredPost.title}</h2>
                  <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{featuredPost.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                    <button className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium">
                      <span>Read More</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.filter(post => !post.featured).map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img
                src={post.image}
                alt={post.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                  <span className="bg-gray-100 px-3 py-1 rounded-full">{post.category}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{post.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <button className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium">
                    <span>Read More</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-primary-600 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to get the latest fitness tips, workout routines, and nutrition advice delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
            <button className="bg-white text-primary-600 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
