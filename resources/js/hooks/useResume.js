import { useState, useCallback, useEffect } from 'react';
import { resumeAPI } from '../services/api';

export const useResume = (resumeId) => {
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchResume = useCallback(async (id) => {
        try {
            setLoading(true);
            setError('');
            const data = await resumeAPI.get(id);
            setResume(data);
        } catch (e) {
            setError('Failed to load resume');
        } finally {
            setLoading(false);
        }
    }, []);

    const createResume = useCallback(async (payload) => {
        const data = await resumeAPI.create(payload);
        setResume(data);
        return data;
    }, []);

    const updateResume = useCallback(async (id, payload) => {
        const data = await resumeAPI.update(id, payload);
        setResume(data);
        return data;
    }, []);

    useEffect(() => {
        if (resumeId) {
            fetchResume(resumeId);
        }
    }, [resumeId, fetchResume]);

    return { resume, loading, error, fetchResume, createResume, updateResume };
};
export default useResume;


