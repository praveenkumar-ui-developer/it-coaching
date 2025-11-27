const API_BASE_URL = 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token, password) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async verifyToken() {
    return this.request('/auth/verify');
  }

  async getUserDashboard() {
    return this.request('/users/dashboard');
  }

  async getEnrolledCourses() {
    console.log('API: Getting enrolled courses');
    console.log('API: Auth headers:', this.getAuthHeaders());
    console.log('API: User ID from token:', this.getUserIdFromToken());
    
    try {
      const result = await this.request('/users/enrolled-courses');
      console.log('API: Enrolled courses result:', result);
      return result;
    } catch (error) {
      console.log('API: Failed to get enrolled courses:', error.message);
      throw error;
    }
  }

  async getCourses() {
    return this.request('/courses');
  }

  async getCourse(id) {
    return this.request(`/courses/${id}`);
  }

  async getStudentCourses() {
    return this.request('/courses/student/all');
  }

  async enrollInCourse(courseId) {
    console.log('API: Enrolling in course', courseId);
    console.log('API: Auth headers:', this.getAuthHeaders());
    console.log('API: User ID from token:', this.getUserIdFromToken());
    
    // Try the standard enrollment endpoint first
    try {
      const result = await this.request('/enroll', {
        method: 'POST',
        body: JSON.stringify({ courseId }),
      });
      console.log('API: Enrollment success:', result);
      return result;
    } catch (error) {
      console.log('API: Primary enrollment failed:', error.message);
      // Fallback to alternative endpoint
      const result = await this.request(`/courses/${courseId}/enroll`, {
        method: 'POST',
      });
      console.log('API: Fallback enrollment success:', result);
      return result;
    }
  }

  getUserIdFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.id || payload.sub;
    } catch (error) {
      return null;
    }
  }

  async getAdminAnalytics() {
    return this.request('/admin/analytics');
  }

  async getUsers() {
    console.log('API: Getting users from /admin/users');
    try {
      const result = await this.request('/admin/users');
      console.log('API: Users response received:', result);
      return result;
    } catch (error) {
      console.error('API: Error getting users:', error);
      throw error;
    }
  }

  async createUser(userData) {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id, userData) {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getAdminCourses() {
    return this.request('/admin/courses');
  }

  async createCourse(courseData) {
    return this.request('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(id, courseData) {
    return this.request(`/admin/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  }

  async deleteCourse(id) {
    return this.request(`/admin/courses/${id}`, {
      method: 'DELETE',
    });
  }

  async getInstructors() {
    return this.request('/admin/instructors');
  }

  async assignInstructor(courseId, instructorId) {
    return this.request('/admin/assign-instructor', {
      method: 'POST',
      body: JSON.stringify({ courseId, instructorId }),
    });
  }

  async getStudentProgress() {
    return this.request('/admin/student-progress');
  }
}

const api = new ApiClient();
export default api;