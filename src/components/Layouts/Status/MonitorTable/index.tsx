import { FC } from 'react';
import MonitorRow from '../MonitorRow';

interface Monitor {
    id: number;
    friendly_name: string;
    type: number;
    status: number;
    all_time_uptime_ratio: string;
    custom_uptime_ratio: string;
    average_response_time: string;
    response_times: Array<{ datetime: number; value: number }>;
    incidents?: Array<{ datetime: number; type: number }>;
    interval: number;
}

interface MonitorTableProps {
    monitors: Monitor[];
    title: string;
}

const MonitorTable: FC<MonitorTableProps> = ({ monitors, title }) => (
    <div className="w-full overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-br from-blue to-green hover:underline">{title}</h3>
        <table className="min-w-full divide-y divide-gray-700 mb-6">
            <thead>
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Monitor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Uptime</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Avg Response</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase"></th>
                </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-gray-700">
                {monitors.map((monitor) => (
                    <MonitorRow key={monitor.id} monitor={monitor} />
                ))}
            </tbody>
        </table>
    </div>
);

export default MonitorTable;