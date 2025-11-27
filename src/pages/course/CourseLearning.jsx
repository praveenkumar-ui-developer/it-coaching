import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Lock, 
  ChevronRight, 
  ChevronDown,
  ChevronLeft,
  Code,
  BookOpen,
  Clock,
  Award,
  RotateCcw,
  Download,
  Settings,
  X,
  Menu
} from 'lucide-react';
import { useTheme } from '../../components/ThemeProvider';
import useAuthStore from '../../store/authStore';
import CodeEditor from '../../components/course/CodeEditor';
import ContentRenderer from '../../components/course/ContentRenderer';
import SEO from '../../components/common/SEO';
import { LearningSkeleton } from '../../components/common/Skeleton';

const CourseLearning = () => {
  const { courseId } = useParams();
  const { getThemeStyles } = useTheme();
  const { user } = useAuthStore();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentModule, setCurrentModule] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [expandedModules, setExpandedModules] = useState(new Set([0]));
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [lessonProgress, setLessonProgress] = useState({});
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}`);
      const data = await response.json();
      
      // Handle both direct course data and wrapped response
      const courseData = data.course || data;
      
      console.log('Raw course data:', courseData);
      console.log('Course modules:', courseData.modules);
      
      // Transform database structure to match component expectations
      const transformedCourse = {
        _id: courseData._id,
        title: courseData.title,
        instructor: courseData.instructor,
        totalDuration: courseData.duration || 0,
        completedDuration: 0,
        progress: 0,
        modules: Array.isArray(courseData.modules) ? courseData.modules.map((module, moduleIndex) => {
          console.log(`Processing module ${moduleIndex}:`, module);
          return {
            _id: module._id,
            title: module.title,
            description: module.description,
            duration: module.topics?.reduce((total, topic) => total + (topic.duration || 0), 0) || 0,
            completed: false,
            lessons: Array.isArray(module.topics) ? module.topics.map((topic, topicIndex) => {
              console.log(`Processing topic ${topicIndex}:`, topic);
              return {
                _id: topic._id,
                title: topic.title,
                type: topic.videoUrl ? 'video' : 'coding',
                duration: topic.duration || 0,
                completed: false,
                videoUrl: topic.videoUrl,
                description: topic.description,
                content: topic.content,
                codeExample: `// ${topic.title}\n// Add your code here`
              };
            }) : []
          };
        }) : []
      };
      
      console.log('Transformed course:', transformedCourse);
      console.log('Transformed modules:', transformedCourse.modules);
      
      setCourse(transformedCourse);
      
      // Initialize progress tracking
      const progress = {};
      transformedCourse.modules?.forEach(module => {
        module.lessons?.forEach(lesson => {
          progress[lesson._id] = lesson.completed;
        });
      });
      setLessonProgress(progress);
      
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleIndex) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleIndex)) {
      newExpanded.delete(moduleIndex);
    } else {
      newExpanded.add(moduleIndex);
    }
    setExpandedModules(newExpanded);
  };

  const selectLesson = (moduleIndex, lessonIndex) => {
    setCurrentModule(moduleIndex);
    setCurrentLesson(lessonIndex);
    
    const lesson = course.modules[moduleIndex].lessons[lessonIndex];
    console.log('Selected lesson:', lesson);
    console.log('Lesson type:', lesson.type);
    
    // Don't auto-show code editor, let user control it manually
  };

  const markLessonComplete = (lessonId) => {
    setLessonProgress(prev => ({
      ...prev,
      [lessonId]: true
    }));
  };

  if (loading) {
    return <LearningSkeleton />;
  }

  const currentLessonData = course?.modules[currentModule]?.lessons[currentLesson];

  const courseStructuredData = course ? {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.modules[0]?.description || `Learn ${course.title} with interactive lessons and coding exercises`,
    "provider": {
      "@type": "Organization",
      "name": "IT Coaching Center",
      "url": "https://itcoachingcenter.com"
    },
    "instructor": {
      "@type": "Person",
      "name": course.instructor
    },
    "courseMode": "online",
    "educationalLevel": "beginner to advanced"
  } : null;

  return (
    <>
      {course && (
        <SEO 
          title={`${course.title} - ${currentLessonData?.title || 'Course Learning'} | IT Coaching Center`}
          description={`Learn ${course.title} with ${course.instructor}. Interactive lessons, coding exercises, and hands-on projects. Progress: ${course.progress}% complete.`}
          keywords={`${course.title}, programming course, ${course.instructor}, online learning, coding tutorial`}
          url={`/course/${courseId}/learn`}
          structuredData={courseStructuredData}
        />
      )}
      <div className="flex h-screen overflow-hidden" style={getThemeStyles({ backgroundColor: '#f8fafc' }, { backgroundColor: '#0f172a' })}>


      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileSidebar(false)}></div>
          <div className="relative w-80 max-w-[90vw] bg-white dark:bg-gray-800 overflow-y-auto max-h-screen">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="w-10"></div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Module</h2>
                <button
                  onClick={() => setShowMobileSidebar(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-3 mt-2">
                <Clock className="w-4 h-4 mr-1" />
                <span>{Math.floor(course?.completedDuration / 60)}h {course?.completedDuration % 60}m / {Math.floor(course?.totalDuration / 60)}h {course?.totalDuration % 60}m</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${course?.progress}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{course?.progress}% Complete</div>
            </div>
            <div className="p-2">
              {course?.modules.map((module, moduleIndex) => (
                <div key={module._id} className="mb-2">
                  <button
                    onClick={() => toggleModule(moduleIndex)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center">
                      {module.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-gray-400 mr-3" />
                      )}
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-white text-sm">{module.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{module.lessons.length} lessons • {module.duration}m</div>
                      </div>
                    </div>
                    {expandedModules.has(moduleIndex) ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {expandedModules.has(moduleIndex) && (
                    <div className="ml-4 mt-2 space-y-1 max-h-48 overflow-y-auto">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <button
                          key={lesson._id}
                          onClick={() => {
                            selectLesson(moduleIndex, lessonIndex);
                            setShowMobileSidebar(false);
                          }}
                          className={`w-full flex items-center p-2 rounded-lg text-left transition-colors ${
                            currentModule === moduleIndex && currentLesson === lessonIndex
                              ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center mr-3">
                            {lessonProgress[lesson._id] ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : lesson.type === 'coding' ? (
                              <Code className="w-4 h-4 text-blue-500" />
                            ) : (
                              <Play className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{lesson.title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {lesson.duration}m
                              {lesson.type === 'coding' && (
                                <span className="ml-2 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
                                  Coding
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar - Course Modules */}
      <div className={`hidden lg:flex lg:flex-col ${sidebarCollapsed ? 'w-12' : 'w-80'} flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 overflow-x-hidden`}>
        {/* Course Header - Fixed */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            {!sidebarCollapsed && <h1 className="text-lg font-bold text-gray-900 dark:text-white">{course?.title}</h1>}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
          {!sidebarCollapsed && (
            <>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-3">
                <Clock className="w-4 h-4 mr-1" />
                <span>{Math.floor(course?.completedDuration / 60)}h {course?.completedDuration % 60}m / {Math.floor(course?.totalDuration / 60)}h {course?.totalDuration % 60}m</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${course?.progress}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{course?.progress}% Complete</div>
            </>
          )}
        </div>

        {/* Modules List - Scrollable */}
        <div className="flex-1 overflow-y-auto p-2">
          {sidebarCollapsed ? (
            // Collapsed view - show only module icons
            <div className="space-y-2">
              {course?.modules.map((module, moduleIndex) => (
                <button
                  key={module._id}
                  onClick={() => {
                    setSidebarCollapsed(false);
                    toggleModule(moduleIndex);
                  }}
                  className="w-full p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-center"
                  title={module.title}
                >
                  {module.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <BookOpen className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            // Expanded view - show full modules
            course?.modules.map((module, moduleIndex) => (
              <div key={module._id} className="mb-2">
                <button
                  onClick={() => toggleModule(moduleIndex)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    {module.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-gray-400 mr-3" />
                    )}
                    <div className="text-left">
                      <div className="font-medium text-gray-900 dark:text-white text-sm">{module.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{module.lessons.length} lessons • {module.duration}m</div>
                    </div>
                  </div>
                  {expandedModules.has(moduleIndex) ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {/* Lessons */}
                {expandedModules.has(moduleIndex) && (
                  <div className="ml-4 mt-2 space-y-1 max-h-48 overflow-y-auto">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <button
                        key={lesson._id}
                        onClick={() => selectLesson(moduleIndex, lessonIndex)}
                        className={`w-full flex items-center p-2 rounded-lg text-left transition-colors ${
                          currentModule === moduleIndex && currentLesson === lessonIndex
                            ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center mr-3">
                          {lessonProgress[lesson._id] ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : lesson.type === 'coding' ? (
                            <Code className="w-4 h-4 text-blue-500" />
                          ) : (
                            <Play className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{lesson.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {lesson.duration}m
                            {lesson.type === 'coding' && (
                              <span className="ml-2 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
                                Coding
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        {/* Lesson Header - Desktop Only */}
        <div className="hidden lg:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{currentLessonData?.title}</h2>
              {/* <p className="text-gray-600 dark:text-gray-300 mt-1">{currentLessonData?.description}</p> */}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCodeEditor(!showCodeEditor)}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  showCodeEditor 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Code className="w-4 h-4 mr-2" />
                {showCodeEditor ? 'Hide' : 'Show'} Code Editor
              </button>
              <button
                onClick={() => markLessonComplete(currentLessonData?._id)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Complete
              </button>
            </div>
          </div>
        </div>

        {/* Content Area - Responsive Layout */}
        <div className="flex-1 flex flex-row overflow-hidden">
          {/* Content/Example Area */}
          <div className={`${showCodeEditor ? 'w-1/2' : 'w-full'} flex flex-col overflow-hidden h-full ${showCodeEditor ? 'border-r border-gray-200 dark:border-gray-700' : ''}`}>
            {/* Content Header */}
            <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between lg:justify-start">
                <button
                  onClick={() => setShowMobileSidebar(true)}
                  className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <h3 className="font-semibold text-gray-900 dark:text-white lg:ml-0 mx-auto lg:mx-0">Lesson Content</h3>
                <button
                  onClick={() => setShowCodeEditor(!showCodeEditor)}
                  className="lg:hidden flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm"
                >
                  <Code className="w-4 h-4 mr-1" />
                  {showCodeEditor ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
              {/* Mobile Lesson Header */}
              <div className="lg:hidden mb-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{currentLessonData?.description}</p>
                <button
                  onClick={() => markLessonComplete(currentLessonData?._id)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mb-4"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Complete
                </button>
              </div>

              {currentLessonData?.type === 'video' ? (
                <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-6">
                  <div className="text-center text-white">
                    <Play className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4" />
                    <p className="text-base lg:text-lg">Video Player</p>
                    <p className="text-sm text-gray-300">{currentLessonData.duration} minutes</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Lesson Description */}
                  {currentLessonData?.description && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 lg:p-6">
                      <h3 className="text-base lg:text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Lesson Overview</h3>
                      <p className="text-blue-800 dark:text-blue-200 text-sm lg:text-base whitespace-pre-wrap">{currentLessonData.description}</p>
                    </div>
                  )}
                  
                  {/* Render formatted lesson content */}
                  {currentLessonData?.content ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
                      <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-4">Lesson Content</h3>
                      <div className="whitespace-pre-wrap font-mono text-xs sm:text-sm leading-relaxed text-gray-800 dark:text-gray-200 break-words">
                        <ContentRenderer content={currentLessonData.content} />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 lg:p-6">
                      <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-4">Interactive Coding Lesson</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm lg:text-base">Use the code editor to practice and experiment with the concepts.</p>
                    </div>
                  )}
                  
                  {/* Code Example Section */}
                  {currentLessonData?.codeExample && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
                      <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-4">Code Example</h3>
                      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                        <code>{currentLessonData.codeExample}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Challenge Section */}
              {currentLessonData?.challenge && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 lg:p-6 mb-6">
                  <div className="flex items-center mb-3">
                    <Award className="w-5 h-5 text-blue-600 mr-2" />
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm lg:text-base">{currentLessonData.challenge.title}</h4>
                  </div>
                  <p className="text-blue-800 dark:text-blue-200 mb-4 text-sm lg:text-base">{currentLessonData.challenge.description}</p>
                  <button className="w-full lg:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base">
                    Start Challenge
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Code Editor Area */}
          {showCodeEditor && (
            <div className="w-1/2 flex flex-col h-full overflow-y-auto">
              <CodeEditor 
                initialCode={currentLessonData?.challenge?.starterCode || '// Start coding here...'}
                language={selectedLanguage}
                theme="dark"
                onLanguageChange={setSelectedLanguage}
              />
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default CourseLearning;