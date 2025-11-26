export const fetchMonitor = ({ id }: { id: string }) => {
    return fetch(`/api/status/monitor?id=${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching status:', error);
            throw new Error('Error fetching status');
        });
};