import axios from 'axios';

const api = axios.create({
    // baseURL: '/api',
    baseURL: 'http://127.0.0.1:8001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

export const resumeAPI = {
    list: () => api.get('/resumes').then(r => (r.data?.data ?? r.data)),
    get: (id) => api.get(`/resumes/${id}`).then(r => (r.data?.data ?? r.data)),
    create: (data) => api.post('/resumes', data).then(r => (r.data?.data ?? r.data)),
    update: (id, data) => api.put(`/resumes/${id}`, data).then(r => (r.data?.data ?? r.data)),
    delete: (id) => api.delete(`/resumes/${id}`),
    exportDocx: async (id) => {
        const res = await api.get(`/resumes/${id}/export-docx`, { responseType: 'blob' });
        return res.data; // Blob
    },
};

// export const experienceAPI = {
//     create: (data) => api.post('/experiences', data).then(r => r.data),
//     update: (id, data) => api.put(`/experiences/${id}`, data).then(r => r.data),
//     delete: (id) => api.delete(`/experiences/${id}`),
// };
export const experienceAPI = {
  create: (data) => api.post("/experiences", data).then(r => r.data),
  update: (id, data) => api.put(`/experiences/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/experiences/${id}`).then(r => r.data),
  listByResume: (resumeId) => api.get(`/resumes/${resumeId}/experiences`).then(r => r.data) // optional helper
};

export const projectAPI = {
    create: (data) => api.post('/projects', data).then(r => r.data),
    update: (id, data) => api.put(`/projects/${id}`, data).then(r => r.data),
    delete: (id) => api.delete(`/projects/${id}`),
};

export const skillAPI = {
    create: (data) => api.post('/skills', data).then(r => r.data),
    update: (id, data) => api.put(`/skills/${id}`, data).then(r => r.data),
    delete: (id) => api.delete(`/skills/${id}`),
};

export const educationAPI = {
    create: (data) => api.post('/educations', data).then(r => r.data),
    update: (id, data) => api.put(`/educations/${id}`, data).then(r => r.data),
    delete: (id) => api.delete(`/educations/${id}`),
};

export const certificationAPI = {
    create: (data) => api.post('/certifications', data).then(r => r.data),
    update: (id, data) => api.put(`/certifications/${id}`, data).then(r => r.data),
    delete: (id) => api.delete(`/certifications/${id}`),
};
export const jobSearchAPI = {
    search: (params) => api.get('/job-search', { params }).then(r => r.data),
};

