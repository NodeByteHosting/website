'use client';

import { FC, useEffect } from 'react';
import { motion } from "framer-motion";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { PageHero } from '@/src/app/components/PageHero/UsePageHero';
import { fetchStatus } from '@/src/fetchers/status';
import { useSWRClient } from '@/providers/SWR/config';
import { Line } from 'react-chartjs-3';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Monitor {
    id: number;
    friendly_name: string;
    type: number;
    status: number;
    custom_uptime_ratio: string;
    response_times: Array<{ datetime: number; value: number }>;
    interval: number;
    url?: string;
}

export const StatusLayout: FC = () => {
    const { data, error, isLoading } = useSWRClient('status', fetchStatus);
    const monitors: Monitor[] = data || [];

    useEffect(() => {
        if (error) {
            console.error('Failed to fetch status:', error);
        }
    }, [error]);

    const getChartData = (responseTimes: Array<{ datetime: number; value: number }>) => {
        return {
            labels: responseTimes.map(rt => new Date(rt.datetime * 1000).toLocaleTimeString()),
            datasets: [
                {
                    label: 'Response Time (ms)',
                    data: responseTimes.map(rt => rt.value),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    pointRadius: 3,
                    fill: true,
                    tension: 0.4,
                },
            ],
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Time',
                    color: 'white',
                    font: {
                        size: 14
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            y: {
                beginAtZero: true,
                min: 0,
                title: {
                    display: true,
                    text: 'Response Time (ms)',
                    color: 'white',
                    font: {
                        size: 14
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
        },
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: 'white'
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        return `${context.parsed.y} ms`;
                    },
                },
            },
        },
    };

    return (
        <>
            <PageHero
                title="Status"
                text="Check the status of our services and any ongoing maintenance."
            />
            <motion.section className="py-16 bg-dark text-white">
                <div className="px-6 mx-auto max-w-screen-xl">
                    {isLoading ? (
                        <Skeleton count={10} />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {monitors.map((monitor) => (
                                <div key={monitor.id} className="p-6 shadow-lg bg-gray-900 hover:bg-gray-800 rounded-lg border border-gray-700 flex flex-col">
                                    <h2 className="text-2xl font-semibold mb-4">{monitor.friendly_name}</h2>
                                    <div className="mb-4">
                                        <p className="text-sm">Status: <span className={`${monitor.status === 2 ? 'text-green-400' : 'text-red-500'}`}>
                                            {monitor.status === 2 ? 'ONLINE' : 'OFFLINE'}
                                        </span></p>
                                        <p className="text-sm">Uptime: <span className="text-gray-400">{monitor.custom_uptime_ratio}%</span></p>
                                        <p className="text-sm">Interval: <span className="text-gray-400">{monitor.interval} seconds</span></p>
                                    </div>
                                    <div className="bg-gray-800 rounded-lg p-4 shadow-md" style={{ height: '250px' }}>
                                        <h3 className="text-lg font-semibold mb-2">Response Times</h3>
                                        <div style={{ height: '200px' }}>
                                            <Line data={getChartData(monitor.response_times)} options={chartOptions} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.section>
        </>
    );
};
