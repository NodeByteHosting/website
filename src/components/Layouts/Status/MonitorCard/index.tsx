import React, { useRef } from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from 'recharts';
import { FaChevronUp, FaChevronDown, FaServer, FaGlobe, FaCloud } from 'react-icons/fa';
import { cn } from "tailwind";

interface StatusCardProps {
    title: string;
    content: string;
    borderRadius?: string;
    duration?: number;
    className?: string;
    containerClassName?: string;
    borderClassName?: string;
    monitor: {
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
    };
    isExpanded: boolean;
    onToggle: () => void;
}

const StatusCard: React.FC<StatusCardProps> = ({
    title,
    content,
    borderRadius = "1rem",
    className,
    containerClassName,
    monitor,
    isExpanded,
    onToggle,
}) => {
    if (!monitor) {
        return null;
    }

    const isOnline = monitor.status === 2;

    const color = useMotionValue(isOnline ? "#2C7A7B" : "#E53E3E");

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

    return (
        <div
            className={cn(
                `relative text-xl overflow-hidden shadow bg-dark border border-green transition-all hover:scale-105`,
                containerClassName
            )}
            style={{
                borderRadius: borderRadius,
            }}
        >

            <div
                className={cn(
                    "relative bg-slate-900/[0.] border border-slate-800 backdrop-blur-2xl text-white flex flex-col items-start justify-center w-full h-full text-base antialiased p-6",
                    className
                )}
                style={{
                    borderRadius: `calc(${borderRadius} * 0.96)`,
                }}
            >
                <div className="flex items-center mb-2">
                    <MonitorIcon className="text-white text-xl mr-2" />
                    <h3 className="text-lg text-transparent bg-clip-text bg-gradient-to-br from-blue to-green">{title}</h3>
                </div>
                <p className="text-gray-300">{content}</p>
                <div className="text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green opacity-40"></div>
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
                <div className="flex justify-center mt-3">
                    <motion.button
                        className="text-gray-400 hover:text-gray-300 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onToggle}
                    >
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </motion.button>
                </div>
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-full bg-slate-900/[0.9] border-t border-gray-700 mt-4 p-4"
                        >
                            <h3 className="text-sm font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-br from-blue to-green">Response Times</h3>
                            <div style={{ height: '300px' }}>
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
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default StatusCard;