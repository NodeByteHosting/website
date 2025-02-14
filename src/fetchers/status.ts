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

            // Process incidents if they exist
            if (monitor.logs) {
                monitor.incidents = monitor.logs.filter((log: any) => log.type === 1 || log.type === 2);
                delete monitor.logs;
            }
        });

        return monitors;
    } catch (error) {
        console.error('Error fetching status:', error);
        throw new Error('Error fetching status');
    }
};