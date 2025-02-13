import axios from 'axios';

export const fetchStatus = async () => {
    try {
        const response = await axios.post('/api/status');
        const monitors = response.data;

        // Process the data if needed
        monitors.forEach((monitor: any) => {
            if (monitor.url !== undefined) {
                delete monitor.url;
            }
        });

        return monitors;
    } catch (error) {
        console.error('Error fetching status:', error);
        throw new Error('Error fetching status');
    }
};