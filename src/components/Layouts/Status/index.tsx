'use client';

import Tabs from './StatusPageTabs';
import Incidents from './Incidents';
import { motion } from "framer-motion";
import MonitorLayout from './MonitorLayout';
import Skeleton from 'react-loading-skeleton';
import { fetchStatus } from 'fetchers/status';
import { PageHero } from 'components/PageHero';
import { FC, useEffect, useState } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSWRClient } from 'providers/SWR/config';
import { FaCheckCircle, FaTimesCircle, FaServer, FaExclamationTriangle } from 'react-icons/fa';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area } from 'recharts';

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

export const StatusLayout: FC = () => {
    const { data, error, isLoading } = useSWRClient('status', fetchStatus);
    const monitors: Monitor[] = data || [];
    const [activeTab, setActiveTab] = useState('Monitors');
    const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

    useEffect(() => {
        if (error) {
            console.error('Failed to fetch status:', error);
        }
    }, [error]);

    const getComposedChartData = (monitor: Monitor) => {
        const downtimeIncidents = monitor.incidents?.filter(incident => incident.type === 1).length || 0;
        return monitor.response_times.map(rt => ({
            datetime: new Date(rt.datetime * 1000).toLocaleTimeString(),
            uptime: parseFloat(monitor.custom_uptime_ratio),
            responseTime: rt.value,
            downtime: downtimeIncidents * monitor.interval / 60,
        }));
    };

    const websiteMonitors = monitors.filter(monitor => !monitor.friendly_name.includes('-'));
    const virtualServers = monitors.filter(monitor => monitor.friendly_name.includes('VM-'));
    const dedicatedServers = monitors.filter(monitor => monitor.friendly_name.includes('DEDI-'));

    const timeRangeOptions = [
        { value: '24h', label: 'Last 24 Hours' },
        { value: '7d', label: 'Last 7 Days' },
        { value: '30d', label: 'Last 30 Days' },
    ];

    return (
        <>
            <PageHero title="Service Status" text="Check real-time service status, uptime history, and maintenance updates." />

            {/* Overall Status Section */}
            <motion.section
                className="py-10 bg-dark text-white">
                <div className="px-6 mx-auto max-w-screen-xl">
                    {/* Status Banner */}
                    <div className="mb-8 text-lg font-bold p-4 rounded-lg shadow-md flex items-center justify-center gap-3"
                        style={{
                            backgroundColor: monitors.every(m => m.status === 2)
                                ? 'rgba(34, 197, 94, 0.2)'
                                : 'rgba(220, 38, 38, 0.2)',
                            backdropFilter: 'blur(8px)'
                        }}
                    >
                        {monitors.every(m => m.status === 2) ? (
                            <><FaCheckCircle className="text-green-400 text-2xl" /> All Systems Operational</>
                        ) : (
                            <><FaExclamationTriangle className="text-red-500 text-2xl" /> Some Systems Are Experiencing Issues</>
                        )}
                    </div>

                    {/* Metrics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        <motion.div
                            className="bg-dark_gray hover:bg-black_secondary transition-all duration-300 p-6 rounded-lg shadow-lg flex items-center group"
                            whileHover={{ scale: 1.02 }}
                        >
                            <FaServer className="text-green-400 text-5xl mr-4 group-hover:scale-110 transition-transform duration-300" />
                            <div className="text-left">
                                <h3 className="text-lg font-bold text-gray-100">
                                    {isLoading ? "Loading..." : "Total Monitors"}
                                </h3>
                                <p className="text-3xl font-bold text-green-400">
                                    {isLoading ? (
                                        <span className="flex gap-1">
                                            <span className="animate-bounce">.</span>
                                            <span className="animate-bounce delay-100">.</span>
                                            <span className="animate-bounce delay-200">.</span>
                                        </span>
                                    ) : monitors.length}
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-dark_gray hover:bg-black_secondary transition-all duration-300 p-6 rounded-lg shadow-lg flex items-center group"
                            whileHover={{ scale: 1.02 }}
                        >
                            <FaCheckCircle className="text-green-400 text-5xl mr-4 group-hover:scale-110 transition-transform duration-300" />
                            <div className="text-left">
                                <h3 className="text-lg font-bold text-gray-100">
                                    {isLoading ? "Loading..." : "Online Monitors"}
                                </h3>
                                <p className="text-3xl font-bold text-green-400">
                                    {isLoading ? (
                                        <span className="flex gap-1">
                                            <span className="animate-bounce">.</span>
                                            <span className="animate-bounce delay-100">.</span>
                                            <span className="animate-bounce delay-200">.</span>
                                        </span>
                                    ) : monitors.filter(m => m.status === 2).length}
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-dark_gray hover:bg-black_secondary transition-all duration-300 p-6 rounded-lg shadow-lg flex items-center group"
                            whileHover={{ scale: 1.02 }}
                        >
                            <FaTimesCircle className="text-red-400 text-5xl mr-4 group-hover:scale-110 transition-transform duration-300" />
                            <div className="text-left">
                                <h3 className="text-lg font-bold text-gray-100">
                                    {isLoading ? "Loading..." : "Offline Monitors"}
                                </h3>
                                <p className="text-3xl font-bold text-red-400">
                                    {isLoading ? (
                                        <span className="flex gap-1">
                                            <span className="animate-bounce">.</span>
                                            <span className="animate-bounce delay-100">.</span>
                                            <span className="animate-bounce delay-200">.</span>
                                        </span>
                                    ) : monitors.filter(m => m.status !== 2).length}
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Time Range Selector */}
                    <div className="flex justify-end mb-6">
                        <div className="inline-flex bg-black_secondary rounded-lg p-1">
                            {timeRangeOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setSelectedTimeRange(option.value)}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${selectedTimeRange === option.value
                                        ? 'bg-dark_gray text-white'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Detailed Stats Section */}
            <motion.section
                className="py-16 bg-grey-800 text-white">
                <div className="px-6 mx-auto max-w-screen-xl">
                    {isLoading ? (
                        <Skeleton count={10} baseColor='#1C2634' highlightColor='#111827' />
                    ) : (
                        <>
                            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

                            {activeTab === 'Monitors' && (
                                <div className="space-y-8">
                                    <MonitorLayout monitors={websiteMonitors} title="Website Monitors" />
                                    <MonitorLayout monitors={dedicatedServers} title="Dedicated Servers" />
                                    <MonitorLayout monitors={virtualServers} title="Virtual Servers" />
                                </div>
                            )}

                            {activeTab === 'Statistics' && (
                                <div className="space-y-8">
                                    {monitors.map((monitor) => (
                                        <div key={monitor.id} className="bg-dark p-6 rounded-lg shadow-lg">
                                            <h3 className="text-lg font-bold text-gray-100 mb-4">{monitor.friendly_name}</h3>
                                            <ResponsiveContainer width="100%" height={400}>
                                                <ComposedChart data={getComposedChartData(monitor)}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="datetime" />
                                                    <YAxis />
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor: "#1C1C1E",
                                                            border: '1px solid #374151',
                                                            borderRadius: '8px'
                                                        }}
                                                    />
                                                    <Legend />
                                                    <Bar dataKey="uptime" fill="#82ca9d" />
                                                    <Line type="monotone" dataKey="responseTime" stroke="#8884d8" />
                                                    <Area type="monotone" dataKey="downtime" fill="#ff7300" stroke="#ff7300" />
                                                </ComposedChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'Incidents' && (
                                <Incidents monitors={monitors} />
                            )}
                        </>
                    )}
                </div>
            </motion.section>
        </>
    );
};