import { useState, useEffect } from 'react';
import api from '../services/api';

export const useAppConfig = () => {
    const [appName, setAppName] = useState('CareerVault Resume Builder');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppName = async () => {
            try {
                const response = await api.get('/config');
                setAppName(response.data.app_name);
            } catch (err) {
                console.error('Failed to fetch app name:', err);
                // Keep default name if fetch fails
            } finally {
                setLoading(false);
            }
        };

        fetchAppName();
    }, []);

    return { appName, loading };
};
