"use client";

import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { usePathname } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { getResponseTimeStats } from "../Status/MonitorLayout";
import { fetchMonitor } from "fetchers/monitor";
import { useSWRClient } from "@/src/providers/SWR/config";
import ErrorLayout from '../../Static/ErrorLayout';
import { ChartBar } from 'lucide-react';

function formatDuration(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
}

// Register the necessary components
Chart.register(...registerables);

export default function MonitorDetail() {
    const pathname = usePathname();
    const id = pathname.split('/').pop();
    const { data, error, isLoading } = useSWRClient('monitor', () => fetchMonitor({ id: id as string }));

    if (error) return <ErrorLayout />;
    if (!data) return <p>Monitor not found.</p>;

    // Compute downtime from logs
    const incidents = data.logs || [];
    const response_times = data.response_times || [];
    const latestIncident = incidents.length > 0 ? incidents[0] : null;
    const downtimeDuration = latestIncident ? formatDuration(latestIncident.duration) : "N/A";
    const last24hUptime = data.status === 2 ? "100%" : "71.219%";
    const stats = getResponseTimeStats(response_times);

    // Format response time data
    const responseData = {
        labels: response_times.map((check: any) => new Date(check.datetime * 1000).toLocaleTimeString()),
        datasets: [
            {
                label: 'Response Time (ms)',
                data: response_times.map((check: any) => check.value),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                fill: true,
            },
        ],
    };

    return (
        <>
            <section className="py-8 bg-dark text-white">
                {isLoading ? (
                    <Skeleton count={10} baseColor='#1C2634' highlightColor='#111827' />
                ) : (
                    <>
                        <div className="container grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-black_secondary p-6 rounded-xl flex items-center">
                                <FaCheckCircle className="text-green-400 mr-2" />
                                <div>
                                    <h3 className="text-lg font-bold">Current Status</h3>
                                    <p className={`text-2xl ${data.status === 2 ? 'text-green-400' : 'text-red-400'}`}>{data.status === 2 ? "Up" : "Down"}</p>
                                    <p className={`text-2xl ${data.status === 2 ? 'text-green-400' : 'text-red-400'}`}>{data.status !== 2 ? `Currently down for ${downtimeDuration}` : ""}</p>
                                </div>
                            </div >
                            <div className="bg-black_secondary p-6 rounded-xl flex items-center">
                                <FaClock className="text-yellow-400 mr-2" />
                                <div>
                                    <h3 className="text-lg font-bold">Last Check</h3>
                                    <p className="text-2xl">{new Date(incidents[0]?.datetime * 1000).toLocaleString()}</p>
                                    <p>Checked every {data.interval / 60} minutes</p>
                                </div>
                            </div>
                            <div className="bg-black_secondary p-6 rounded-xl flex items-center">
                                <FaTimesCircle className="text-red-400 mr-2" />
                                <div>
                                    <h3 className="text-lg font-bold">Last 24 hours</h3>
                                    <p className="text-2xl">{last24hUptime}</p>
                                    <p>{incidents.length} incident(s), {downtimeDuration} down</p>
                                </div>
                            </div>
                        </div >

                        <div className="container mt-8 bg-black_secondary p-6 rounded-xl">
                            <h3 className="text-lg font-bold">Response Time</h3>
                            <Line data={responseData} options={{ responsive: true }} />
                            <div className="mt-4 flex justify-between items-center">
                                <div className="flex items-center">
                                    <ChartBar className="text-green-400 mr-2" />
                                    <div className="text-center">
                                        <p className="text-sm">Average</p>
                                        <p className="text-2xl">{stats.average} ms</p>
                                    </div>
                                </div>
                                <div className="border-l border-gray-600 mx-4 h-10"></div>
                                <div className="flex items-center">
                                    <span className="text-red-400 mr-2">↓</span>
                                    <div className="text-center">
                                        <p className="text-sm">Minimum</p>
                                        <p className="text-2xl">{stats.min} ms</p>
                                    </div>
                                </div>
                                <div className="border-l border-gray-600 mx-4 h-10"></div>
                                <div className="flex items-center">
                                    <span className="text-green-400 mr-2">↑</span>
                                    <div className="text-center">
                                        <p className="text-sm">Maximum</p>
                                        <p className="text-2xl">{stats.max} ms</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container mt-8 bg-black_secondary p-6 rounded-xl">
                            <h3 className="text-lg font-bold">Latest Incidents</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-gray-800 text-white">
                                    <thead>
                                        <tr>
                                            <th className="py-2 text-left">Incident ID</th>
                                            <th className="py-2 text-left">Type</th>
                                            <th className="py-2 text-left">Started</th>
                                            <th className="py-2 text-left">Duration</th>
                                            <th className="py-2 text-left">Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {incidents.map((incident: any) => (
                                            <tr key={incident.id} className="border-b border-gray-700">
                                                <td className="py-2">{incident.id}</td>
                                                <td className="py-2">{incident.type === 1 ? "Down" : "Up"}</td>
                                                <td className="py-2">{new Date(incident.datetime * 1000).toLocaleString()}</td>
                                                <td className="py-2">{incident.duration ? formatDuration(incident.duration) : "N/A"}</td>
                                                <td className="py-2">{incident.reason?.detail || "N/A"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </section >
        </>
    );
}
