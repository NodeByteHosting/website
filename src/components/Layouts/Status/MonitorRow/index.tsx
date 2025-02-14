import { FC, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from 'recharts';

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

const MonitorRow: FC<{ monitor: Monitor }> = ({ monitor }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getAreaChartData = (response_times: Array<{ datetime: number; value: number }>) => {
        return response_times.map(rt => ({
            name: new Date(rt.datetime * 1000).toLocaleTimeString(),
            value: rt.value,
        }));
    };

    return (
        <>
            <tr className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <td className="p-4">{monitor.friendly_name}</td>
                <td className="p-4">{monitor.status === 2 ? <FaCheckCircle className="text-green" /> : <FaTimesCircle className="text-red-500" />}</td>
                <td className="p-4">{monitor.all_time_uptime_ratio}%</td>
                <td className="p-4">{monitor.average_response_time}ms</td>
                <td className="p-4 text-right">{isExpanded ? <FaChevronUp /> : <FaChevronDown />}</td>
            </tr>
            {isExpanded && (
                <tr>
                    <td colSpan={5} className="p-4">
                        <h3 className="text-lg font-semibold mb-2">Response Times</h3>
                        <div style={{ height: '200px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    width={500}
                                    height={400}
                                    data={getAreaChartData(monitor.response_times || [])}
                                    margin={{
                                        top: 10,
                                        right: 30,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip contentStyle={{ backgroundColor: "#1C1C1E" }} />
                                    <Area type="monotone" dataKey="value" stroke="#2C74B3" fill="#42d392" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

export default MonitorRow;