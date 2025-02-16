import { FC } from 'react';
import { FaCheckCircle, FaTimesCircle, FaChevronDown, FaChevronUp, FaServer, FaGlobe, FaCloud } from 'react-icons/fa';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimationFrame, useMotionTemplate } from 'framer-motion';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from 'recharts';
import { MovingBorder } from 'ui/MovingBorder';
import { useRef } from "react";
import { cn } from 'tailwind';

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

interface MonitorRowProps {
    monitor: Monitor;
    isExpanded: boolean;
    onToggle: () => void;
}

const MonitorRow: FC<MonitorRowProps> = ({ monitor, isExpanded, onToggle }) => {
    const getAreaChartData = (response_times: Array<{ datetime: number; value: number }>) => {
        return response_times.map(rt => ({
            name: new Date(rt.datetime * 1000).toLocaleTimeString(),
            value: rt.value,
        }));
    };

    const getMonitorIcon = () => {
        if (monitor.friendly_name.includes('VM-')) return FaCloud;
        if (monitor.friendly_name.includes('DEDI-')) return FaServer;
        return FaGlobe;
    };

    const MonitorIcon = getMonitorIcon();
    const isOnline = monitor.status === 2;

    return (
        <motion.div 
            className="bg-no-repeat bg-center bg-cover bg-[url('/bgAnimDark.svg')] border border-blue/50 transition-all duration-300 rounded-lg shadow-lg overflow-hidden"
            whileHover={{ scale: 1.02 }}
        >
            <div 
                className="p-4 cursor-pointer"
                onClick={onToggle}
            >
                {/* Header with Icon and Status */}
                <div className="flex items-center justify-between mb-3">
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
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 opacity-40"></div>
                        <span className="text-gray-400">Uptime Percentage</span>
                    </div>
                    <div className="text-right font-medium text-gray-100">
                        {monitor.all_time_uptime_ratio}%
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400 opacity-40"></div>
                        <span className="text-gray-400">Average Response</span>
                    </div>
                    <div className="text-right font-medium text-gray-100">
                        {monitor.average_response_time}ms
                    </div>
                </div>

                {/* Expand/Collapse Button */}
                <div className="flex justify-center mt-3">
                    <motion.button
                        className="text-gray-400 hover:text-gray-300 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </motion.button>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-700"
                    >
                        <div className="p-4">
                            <h3 className="text-sm font-semibold mb-2 text-gray-100">Response Times</h3>
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
};

export default MonitorRow;