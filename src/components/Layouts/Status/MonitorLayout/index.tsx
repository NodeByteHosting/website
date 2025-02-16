import { FC, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaChevronDown, FaChevronUp, FaServer, FaGlobe, FaCloud } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
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

interface MonitorLayoutProps {
    monitors: Monitor[];
    title: string;
}

const MonitorLayout: FC<MonitorLayoutProps> = ({ monitors, title }) => {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const handleToggle = (monitorId: number) => {
        setExpandedId(expandedId === monitorId ? null : monitorId);
    };

    const getAreaChartData = (response_times: Array<{ datetime: number; value: number }>) => {
        return response_times.map(rt => ({
            name: new Date(rt.datetime * 1000).toLocaleTimeString(),
            value: rt.value,
        }));
    };

    const getMonitorIcon = (friendly_name: string) => {
        if (friendly_name.includes('VM-')) return FaCloud;
        if (friendly_name.includes('DEDI-')) return FaServer;
        return FaGlobe;
    };

    return (
        <div className="mb-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <div>
                {monitors.map((monitor) => {
                    const MonitorIcon = getMonitorIcon(monitor.friendly_name);
                    const isOnline = monitor.status === 2;
                    const downtimePercentage = (100 - parseFloat(monitor.all_time_uptime_ratio)).toFixed(2);

                    return (
                        <motion.div
                            key={monitor.id}
                            className="relative bg-no-repeat bg-center bg-cover bg-[url('/bgAnimDark.svg')] border border-blue/50 transition-all duration-300 rounded-lg shadow-lg mb-4 overflow-hidden"
                            whileHover={{ scale: 1.02 }}
                        >

                            <div
                                className="p-4 cursor-pointer relative z-10 bg-slate-900/[0.8] border border-slate-800 backdrop-blur-2xl text-white flex flex-col items-start justify-center w-full h-full text-base antialiased"
                                onClick={() => handleToggle(monitor.id)}
                            >
                                {/* Header with Icon and Status */}
                                <div className="flex items-center justify-between mb-3 w-full">
                                    <div className="flex items-center gap-3">
                                        <MonitorIcon className="text-gray-400 text-xl" />
                                        <h4 className="font-medium text-gray-100 truncate">{monitor.friendly_name}</h4>
                                    </div>
                                    {isOnline ? (
                                        <FaCheckCircle className="text-green-400 text-xl" />
                                    ) : (
                                        <FaTimesCircle className="text-red-400 text-xl" />
                                    )}
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-y-2 text-sm w-full">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green opacity-40"></div>
                                        <span className="text-gray-400">Uptime Percentage</span>
                                    </div>
                                    <div className="text-right font-medium text-gray-100">
                                        {monitor.all_time_uptime_ratio}%
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-400 opacity-40"></div>
                                        <span className="text-gray-400">Downtime Percentage</span>
                                    </div>
                                    <div className="text-right font-medium text-gray-100">
                                        {downtimePercentage}%
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue opacity-40"></div>
                                        <span className="text-gray-400">Average Response</span>
                                    </div>
                                    <div className="text-right font-medium text-gray-100">
                                        {monitor.average_response_time}ms
                                    </div>
                                </div>

                                {/* Expand/Collapse Button */}
                                <div className="flex justify-center mt-3 w-full">
                                    <motion.button
                                        className="text-gray-400 hover:text-gray-300 transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {expandedId === monitor.id ? <FaChevronUp /> : <FaChevronDown />}
                                    </motion.button>
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedId === monitor.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="border-t border-gray-700 relative z-10"
                                    >
                                        <div className="p-4">
                                            <h3 className="text-sm font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-br from-blue to-green underline">Response Times</h3>
                                            <div style={{ height: '200px' }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart
                                                        data={getAreaChartData(monitor.response_times || [])}
                                                        margin={{
                                                            top: 10,
                                                            right: 10,
                                                            left: 0,
                                                            bottom: 0,
                                                        }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                        <XAxis dataKey="name" stroke="#9CA3AF" />
                                                        <YAxis stroke="#9CA3AF" />
                                                        <Tooltip
                                                            contentStyle={{
                                                                backgroundColor: "#1C1C1E",
                                                                border: '1px solid #374151',
                                                                borderRadius: '8px'
                                                            }}
                                                        />
                                                        <Area
                                                            type="monotone"
                                                            dataKey="value"
                                                            stroke="#2C74B3"
                                                            fill="#42d392"
                                                            fillOpacity={0.3}
                                                        />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default MonitorLayout;