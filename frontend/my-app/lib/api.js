import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Participants
export const participantAPI = {
  getAll: () => api.get('/participants'),
  getById: (id) => api.get(`/participants/${id}`),
  create: (data) => api.post('/participants', data),
  update: (id, data) => api.put(`/participants/${id}`, data),
  delete: (id) => api.delete(`/participants/${id}`),
};

// Instructors
export const instructorAPI = {
  getAll: () => api.get('/instructors'),
  getById: (id) => api.get(`/instructors/${id}`),
  create: (data) => api.post('/instructors', data),
  update: (id, data) => api.put(`/instructors/${id}`, data),
  delete: (id) => api.delete(`/instructors/${id}`),
};

// Classes
export const classAPI = {
  getAll: () => api.get('/classes'),
  getById: (id) => api.get(`/classes/${id}`),
  create: (data) => api.post('/classes', data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`),
};

// Registrations
export const registrationAPI = {
  // Participant registrations
  registerParticipant: (data) => api.post('/registrations/participant', data),
  getParticipantClasses: (participantId) => api.get(`/registrations/participant/${participantId}/classes`),
  getClassParticipants: (classId) => api.get(`/registrations/class/${classId}/participants`),
  cancelParticipantRegistration: (id) => api.delete(`/registrations/participant/${id}`),
  
  // Instructor registrations
  registerInstructor: (data) => api.post('/registrations/instructor', data),
  getInstructorClasses: (instructorId) => api.get(`/registrations/instructor/${instructorId}/classes`),
  getClassInstructors: (classId) => api.get(`/registrations/class/${classId}/instructors`),
  cancelInstructorRegistration: (id) => api.delete(`/registrations/instructor/${id}`),
};

export default api;