import { auth } from '@/lib/firebase';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthToken = async (): Promise<string | null> => {
  if (auth.currentUser) {
    return await auth.currentUser.getIdToken();
  }
  return null;
};

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = await getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
};

export const api = {
  // User endpoints
  createUser: (userData: any) => apiRequest('/users/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  getProfile: () => apiRequest('/users/profile'),
  
  updateProfile: (profileData: any) => apiRequest('/users/profile', {
    method: 'POST',
    body: JSON.stringify(profileData),
  }),
  
  searchUsers: (skill: string) => apiRequest(`/users/search?skill=${encodeURIComponent(skill)}`),
  
  getUserById: (userId: string) => apiRequest(`/users/${userId}`),
  
  getUserPoints: () => apiRequest('/user/points'),

  // Idea generation
  generateIdea: (ideaData: any) => apiRequest('/idea', {
    method: 'POST',
    body: JSON.stringify(ideaData),
  }),

  // Collaboration requests
  sendCollaborationRequest: (requestData: any) => apiRequest('/requests/send', {
    method: 'POST',
    body: JSON.stringify(requestData),
  }),
  
  getRequests: () => apiRequest('/requests'),
  
  respondToRequest: (requestId: string, response: 'accept' | 'reject') => 
    apiRequest(`/requests/respond/${requestId}`, {
      method: 'POST',
      body: JSON.stringify({ response }),
    }),

  // AI Tools
  generateImage: (description: string) => apiRequest('/generate-image', {
    method: 'POST',
    body: JSON.stringify({ description }),
  }),
  
  speechToText: (audioFile: File) => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    return apiRequest('/speech-to-text', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    });
  },
  
  textToSpeech: (text: string) => apiRequest('/text-to-speech', {
    method: 'POST',
    body: JSON.stringify({ text }),
  }),

  // Forum
  getForumPosts: () => apiRequest('/forum/posts'),
  
  createForumPost: (postData: any) => apiRequest('/forum/posts', {
    method: 'POST',
    body: JSON.stringify(postData),
  }),
};