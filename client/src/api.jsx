import axios from 'axios';

const API_BASE_URL = 'https://go-note.vercel.app/api';
const api = axios.create({
    baseURL: API_BASE_URL,
});

export const getNotes = (email) => api.get(`/notes/${email}`);

export const saveNote = (notesToSave, email) => api.post('/notes/saveNote', { notesToSave, email });
export default api;
