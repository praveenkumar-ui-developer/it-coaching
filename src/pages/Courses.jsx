import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, Heart } from 'lucide-react';
import api from '../utils/api';
import { useTheme } from '../components/ThemeProvider';
import CourseFilters from '../components/course/CourseFilters';
import SEO from '../components/common/SEO';
import { CardSkeleton } from '../components/common/Skeleton';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getThemeStyles } = useTheme();

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    setFilteredCourses(courses);
  }, [courses]);

  const fetchCourses = async () => {
    try {
      const response = await api.getCourses();
      setCourses(response.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    let filtered = [...courses];
    
    if (filters.search) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.shortDescription.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.category !== 'all') {
      filtered = filtered.filter(course => course.category === filters.category);
    }
    
    if (filters.level !== 'all') {
      filtered = filtered.filter(course => course.level === filters.level);
    }
    
    if (filters.rating !== 'all') {
      filtered = filtered.filter(course => course.stats?.averageRating >= parseInt(filters.rating));
    }
    
    if (filters.price === 'free') {
      filtered = filtered.filter(course => course.price === 0);
    } else if (filters.price === 'paid') {
      filtered = filtered.filter(course => course.price > 0);
    }
    
    setFilteredCourses(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
        <div className="container-responsive">
          <div className="text-center mb-8 sm:mb-12">
            <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 w-96 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
          </div>
          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="grid-responsive">
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  const coursesStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Programming Courses",
    "description": "Comprehensive collection of IT and programming courses",
    "numberOfItems": filteredCourses.length,
    "itemListElement": filteredCourses.slice(0, 10).map((course, index) => ({
      "@type": "Course",
      "position": index + 1,
      "name": course.title,
      "description": course.shortDescription,
      "provider": {
        "@type": "Organization",
        "name": "IT Coaching Center"
      },
      "offers": {
        "@type": "Offer",
        "price": course.price || 99,
        "priceCurrency": "USD"
      }
    }))
  };

  return (
    <>
      <SEO 
        title="Programming Courses - Web Development, Python, React | IT Coaching Center"
        description={`Browse ${courses.length}+ programming courses including web development, Python, React, JavaScript and more. Learn from expert instructors with hands-on projects.`}
        keywords="programming courses, web development courses, Python courses, React courses, JavaScript training, coding bootcamp, online programming"
        url="/courses"
        structuredData={coursesStructuredData}
      />
      <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
      <div className="container-responsive">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            All Courses
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 px-4">
            Choose from our comprehensive collection of IT courses
          </p>
        </div>

        <CourseFilters onFilterChange={handleFilterChange} courses={courses} />
        
        <div className="grid-responsive">
          {filteredCourses.map((course) => (
            <div 
              key={course._id} 
              className="card hover:shadow-lg transition-shadow"
            >
              <img 
                src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'} 
                alt={course.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {course.title}
              </h3>
              <p className="mb-3 line-clamp-2 text-gray-600 dark:text-gray-300">
                {course.shortDescription}
              </p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {course.stats?.averageRating || 0}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    ({course.stats?.totalRatings || 0})
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {Math.round(course.duration / 60) || 10}h
                  </span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {course.stats?.totalEnrollments || 0}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-indigo-600">
                  ${course.price || 99}
                </div>
                <Link to={`/course/${course._id}`} className="btn-primary">
                  View Course
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && courses.length > 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              No courses match your filters.
            </p>
          </div>
        )}
        
        {courses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              No courses available at the moment.
            </p>
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default Courses;