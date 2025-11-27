import { useState, useEffect } from 'react';
import { Users, Target, Award, Heart } from 'lucide-react';
import { AboutSkeleton } from '../components/common/Skeleton';

const About = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <AboutSkeleton />;
  }
  const values = [
    {
      icon: <Target className="w-8 h-8 text-indigo-600" />,
      title: "Our Mission",
      description: "To make quality IT education accessible to everyone, empowering individuals to build successful careers in technology."
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      title: "Expert Instructors",
      description: "Learn from industry professionals with years of real-world experience in leading tech companies."
    },
    {
      icon: <Award className="w-8 h-8 text-indigo-600" />,
      title: "Quality Content",
      description: "Carefully curated courses with hands-on projects, interactive coding challenges, and industry-recognized certificates."
    },
    {
      icon: <Heart className="w-8 h-8 text-indigo-600" />,
      title: "Student Success",
      description: "We're committed to your success with personalized mentorship, career guidance, and lifetime access to course materials."
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://i.pravatar.cc/150?img=1",
      bio: "Former Google engineer with 15+ years of experience in software development and education."
    },
    {
      name: "Michael Chen",
      role: "Head of Curriculum",
      image: "https://i.pravatar.cc/150?img=2",
      bio: "Ex-Microsoft educator specializing in full-stack development and cloud technologies."
    },
    {
      name: "Emily Rodriguez",
      role: "Lead Instructor",
      image: "https://i.pravatar.cc/150?img=3",
      bio: "Data Science expert with a passion for making complex concepts easy to understand."
    },
    {
      name: "David Kim",
      role: "Community Manager",
      image: "https://i.pravatar.cc/150?img=4",
      bio: "Dedicated to building a supportive learning community and helping students achieve their goals."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About IT Coach</h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            We're on a mission to transform lives through quality IT education, 
            making cutting-edge technology skills accessible to everyone.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  Founded in 2020, IT Coach was born from a simple observation: quality IT education 
                  was either too expensive or too theoretical. We set out to change that.
                </p>
                <p>
                  Our platform combines the best of both worlds - affordable pricing with practical, 
                  hands-on learning experiences. We believe that everyone deserves access to the skills 
                  that can transform their career and life.
                </p>
                <p>
                  Today, we've helped over 10,000 students from around the world launch successful 
                  careers in technology. Our courses are designed by industry experts and updated 
                  regularly to reflect the latest trends and best practices.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600" 
                alt="Team collaboration"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Values</h2>
            <p className="text-xl text-slate-600">What drives us every day</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-slate-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-slate-600">
              Passionate educators dedicated to your success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card text-center">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-indigo-600 text-sm font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-slate-600 text-sm">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-indigo-200">Students Enrolled</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-indigo-200">Expert Courses</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-indigo-200">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-indigo-200">Support Available</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;