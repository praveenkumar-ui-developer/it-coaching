import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Award, Code, Play, Star } from 'lucide-react';
import SEO from '../components/common/SEO';

const Home = () => {
  const features = [
    {
      icon: <Code className="w-8 h-8 text-indigo-600" />,
      title: "Interactive Coding",
      description: "Practice coding with our built-in editor and real-time feedback"
    },
    {
      icon: <Play className="w-8 h-8 text-indigo-600" />,
      title: "Video Lessons",
      description: "Learn from expert instructors with high-quality video content"
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      title: "Expert Instructors",
      description: "Learn from industry professionals with years of experience"
    },
    {
      icon: <Award className="w-8 h-8 text-indigo-600" />,
      title: "Certificates",
      description: "Earn certificates upon course completion to showcase your skills"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Students" },
    { number: "50+", label: "Courses" },
    { number: "20+", label: "Instructors" },
    { number: "95%", label: "Success Rate" }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "IT Coaching Center",
    "url": "https://itcoachingcenter.com",
    "description": "Interactive programming and web development courses with expert instructors",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://itcoachingcenter.com/courses?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "IT Coaching Center",
      "logo": "https://itcoachingcenter.com/logo.png"
    }
  };

  return (
    <>
      <SEO 
        title="IT Coaching Center - Learn Programming & Web Development Online"
        description="Master IT skills with interactive courses, coding challenges, and expert instructors. Join 10,000+ students learning web development, Python, React, JavaScript and more."
        keywords="programming courses, web development, coding bootcamp, IT training, online learning, React, JavaScript, Python, full stack development"
        url="/"
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white py-20">
        <div className="container-responsive">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Master IT Skills with
                <span className="text-indigo-400"> Expert Guidance</span>
              </h1>
              <p className="text-xl text-indigo-100 mb-8">
                Join thousands of students learning cutting-edge technology skills through 
                interactive courses, hands-on projects, and personalized mentorship.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/courses" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
                  Explore Courses
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link to="/signup" className="btn-secondary bg-white text-indigo-900 hover:bg-indigo-50 text-lg px-8 py-4 inline-flex items-center">
                  Start Free Trial
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-6 h-6 text-indigo-400" />
                    <span className="text-lg">Interactive Learning Platform</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Code className="w-6 h-6 text-indigo-400" />
                    <span className="text-lg">Built-in Code Editor</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="w-6 h-6 text-indigo-400" />
                    <span className="text-lg">Industry Certificates</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-6 h-6 text-indigo-400" />
                    <span className="text-lg">Expert Mentorship</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="container-responsive">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 dark:text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container-responsive">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Why Choose IT Coach?
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto px-4">
              Our platform combines the best of online learning with practical, 
              hands-on experience to help you master in-demand IT skills.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Popular Courses
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Start your learning journey with our most popular courses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Full Stack Web Development",
                instructor: "John Smith",
                rating: 4.9,
                students: 2500,
                price: 99,
                image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400"
              },
              {
                title: "Python for Data Science",
                instructor: "Sarah Johnson",
                rating: 4.8,
                students: 1800,
                price: 79,
                image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400"
              },
              {
                title: "React & Node.js Masterclass",
                instructor: "Mike Chen",
                rating: 4.9,
                students: 3200,
                price: 129,
                image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400"
              }
            ].map((course, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {course.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-3">by {course.instructor}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{course.rating}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">({course.students})</span>
                  </div>
                  <div className="text-2xl font-bold text-indigo-600">
                    ${course.price}
                  </div>
                </div>
                <Link to="/courses" className="btn-primary w-full text-center">
                  Enroll Now
                </Link>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/courses" className="btn-secondary text-lg px-8 py-4 inline-flex items-center">
              View All Courses
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your IT Journey?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have transformed their careers with our courses. 
            Start learning today with our free trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-primary bg-white text-indigo-600 hover:bg-indigo-50 text-lg px-8 py-4">
              Start Free Trial
            </Link>
            <Link to="/courses" className="btn-secondary border-white text-white hover:bg-white hover:text-indigo-600 text-lg px-8 py-4">
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default Home;