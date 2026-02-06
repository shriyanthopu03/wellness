import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chat API
export const chatAPI = {
  sendMessage: async (userId, message, context) => {
    try {
      const response = await api.post('/chat', {
        user_id: userId,
        message: message,
        context: context,
      });
      return response.data;
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  },
};

// Recommendation API
export const recommendationAPI = {
  getRecommendation: async (context) => {
    try {
      const response = await api.post('/recommendation', context);
      return response.data;
    } catch (error) {
      console.error('Recommendation error:', error);
      throw error;
    }
  },
};

// Wellness Plan API
export const wellnessPlanAPI = {
  getPlan: async (context) => {
    try {
      const response = await api.post('/wellness-plan', context);
      return response.data;
    } catch (error) {
      console.error('Wellness plan error:', error);
      throw error;
    }
  },
};

// Doubts API
export const doubtsAPI = {
  clarifyDoubt: async (userId, question, context) => {
    try {
      const response = await api.post('/clarify-doubt', {
        user_id: userId,
        question: question,
        context: context,
      });
      return response.data;
    } catch (error) {
      console.error('Doubt clarification error:', error);
      throw error;
    }
  },
};

// Store API
export const storeAPI = {
  getItems: async () => {
    try {
      const response = await api.get('/store');
      return response.data;
    } catch (error) {
      console.error('Store error:', error);
      throw error;
    }
  },
};

// User API
export const userAPI = {
  getUser: async (userId) => {
    try {
      const response = await api.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },
  login: async (email) => {
    try {
      const response = await api.post('/login', { email });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  signup: async (context) => {
    try {
      const response = await api.post('/signup', context);
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },
  updateUser: async (context) => {
    try {
      const response = await api.post('/user/update', context);
      return response.data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },
};

export default api;
