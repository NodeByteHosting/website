'use client';

import Tabs from './Tabs';
import Incidents from './Incidents';
import { motion } from "framer-motion";
import MonitorTable from './MonitorTable';
import Skeleton from 'react-loading-skeleton';
import { fetchStatus } from 'fetchers/status';
import { PageHero } from 'components/PageHero';
import { FC, useEffect, useState } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSWRClient } from 'providers/SWR/config';
import { FaCheckCircle, FaTimesCircle, FaServer, FaExclamationTriangle } from 'react-icons/fa';
import { ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
    const [activeTab, setActiveTab] = useState('Statistics');

    useEffect(() => {
        if (error) {
            console.error('Failed to fetch status:', error);
        }
    }, [error]);

    const getComposedChartData = () => {
        return monitors.map(m => {
            const downtimeIncidents = m.incidents?.filter(incident => incident.type === 1).length || 0;
            return {
                name: m.friendly_name,
                uptime: parseFloat(m.custom_uptime_ratio),
                responseTime: m.response_times.reduce((acc, rt) => acc + rt.value, 0) / m.response_times.length,
                downtime: downtimeIncidents * m.interval / 60, // Assuming interval is in seconds, convert to minutes
            };
        });
    };

    const websiteMonitors = monitors.filter(monitor => !monitor.friendly_name.includes('-'));
    const virtualServers = monitors.filter(monitor => monitor.friendly_name.includes('VM-'));
    const dedicatedServers = monitors.filter(monitor => monitor.friendly_name.includes('DEDI-'));

    return (
        <>
            <PageHero title="Service Status" text="Check real-time service status, uptime history, and maintenance updates." />
            <motion.section className="py-10 bg-dark text-white">
                <div className="px-6 mx-auto max-w-screen-xl text-center">
                    <div className="mb-6 text-lg font-bold p-4 rounded-lg shadow-md" style={{ backgroundColor: monitors.every(m => m.status === 2) ? 'rgba(34, 197, 94, 0.2)' : 'rgba(220, 38, 38, 0.2)' }}>
                        {monitors.every(m => m.status === 2) ? (
                            <><FaCheckCircle className="text-green-400 text-xl" /> All Systems Operational</>
                        ) : (
                            <><FaExclamationTriangle className="text-red-500 text-xl" /> Some Systems Are Experiencing Issues</>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-dark_gray hover:bg-black_secondary transition-all hover:scale-105 p-6 rounded-lg shadow-lg flex items-center">
                            <FaServer className="text-green-400 text-5xl mr-4" />
                            <div className="text-left">
                                <h3 className="text-lg font-bold">
                                    {isLoading ? "Loading..." : "Total Monitors"}
                                </h3>
                                <p className="text-3xl">
                                    {isLoading ? (
                                        <span className="flex justify-center items-center">
                                            <span className="animate-bounce">.</span>
                                            <span className="animate-bounce delay-200">.</span>
                                            <span className="animate-bounce delay-400">.</span>
                                        </span>
                                    ) : (
                                        monitors.length
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="bg-dark_gray hover:bg-black_secondary transition-all hover:scale-105 p-6 rounded-lg shadow-lg flex items-center">
                            <FaCheckCircle className="text-green-400 text-5xl mr-4" />
                            <div className="text-left">
                                <h3 className="text-lg font-bold">
                                    {isLoading ? "Loading..." : "Online Monitors"}
                                </h3>
                                <p className="text-3xl">
                                    {isLoading ? (
                                        <span className="flex justify-center items-center">
                                            <span className="animate-bounce">.</span>
                                            <span className="animate-bounce delay-200">.</span>
                                            <span className="animate-bounce delay-400">.</span>
                                        </span>
                                    ) : (
                                        monitors.filter(m => m.status === 2).length
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="bg-dark_gray hover:bg-black_secondary transition-all hover:scale-105 p-6 rounded-lg shadow-lg flex items-center">
                            <FaTimesCircle className="text-red-400 text-5xl mr-4" />
                            <div className="text-left">
                                <h3 className="text-lg font-bold">
                                    {isLoading ? "Loading..." : "Offline Monitors"}
                                </h3>
                                <p className="text-3xl">
                                    {isLoading ? (
                                        <span className="flex justify-center items-center">
                                            <span className="animate-bounce">.</span>
                                            <span className="animate-bounce delay-200">.</span>
                                            <span className="animate-bounce delay-400">.</span>
                                        </span>
                                    ) : (
                                        monitors.filter(m => m.status !== 2).length
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>
            <motion.section className="py-16 bg-grey-800 text-white">
                <div className="px-6 mx-auto max-w-fit-content">
                    {isLoading ? (
                        <Skeleton count={10} baseColor='#1C2634' highlightColor='#111827' />
                    ) : (
                        <>
                            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                            {activeTab === 'Monitors' && (
                                <div className="bg-no-repeat bg-center bg-cover bg-[url('/bgAnimDark.svg')] p-6 rounded-lg shadow-lg w-full overflow-x-auto">
                                    <MonitorTable monitors={websiteMonitors} title="Website Monitors" />
                                    <MonitorTable monitors={dedicatedServers} title="Server Monitors" />
                                    <MonitorTable monitors={virtualServers} title="Virtual Server Monitors" />
                                </div>
                            )}
                            {activeTab === 'Statistics' && (
                                <div className="bg-no-repeat bg-center bg-cover bg-[url('/bgAnimDark.svg')] p-6 rounded-lg shadow-lg max-w-fit-content">
                                    <h3 className="text-lg font-semibold mb-4">7-Day Uptime Overview</h3>
                                    <div style={{ height: '400px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ComposedChart
                                                layout="vertical"
                                                width={500}
                                                height={400}
                                                data={getComposedChartData()}
                                                margin={{
                                                    top: 20,
                                                    right: 20,
                                                    bottom: 20,
                                                    left: 20,
                                                }}
                                            >
                                                <CartesianGrid stroke="#f5f5f5" />
                                                <XAxis type="number" />
                                                <YAxis dataKey="name" type="category" scale="band" />
                                                <Tooltip contentStyle={{ backgroundColor: "#1C1C1E" }} />
                                                <Legend />
                                                <Area dataKey="uptime" fill="#42d392" stroke="#42d392" />
                                                <Bar dataKey="responseTime" barSize={20} fill="#2C74B3" />
                                                <Line dataKey="downtime" stroke="#FF0000" />
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    </div>
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