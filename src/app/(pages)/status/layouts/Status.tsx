'use client';

import { useEffect, useState, FC } from 'react';
import { motion } from "framer-motion";
import { PulseTitleBanner } from '../components/PulseTitleBanner';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface Monitor {
    id: string;
    name: string;
    type: string;
    uptime_status: string;
    monitor_status: string;
    uptime: string;
    resolve_address_info: {
        ASN: string;
        ISP: string;
        City: string;
        Region: string;
        Country: string;
    };
    locations: {
        [key: string]: {
            uptime_status: string;
            response_time: number;
            last_check: number;
        };
    };
}

interface ApiResponse {
    status: string;
    monitors: Monitor[];
    code: number;
}

export const StatusLayout: FC = ({ }) => {
    const [monitors, setMonitors] = useState<Monitor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMonitors = async () => {
            const res = await fetch('/api/hetrix');
            const data: ApiResponse = await res.json();

            if (data.status === 'OK') {
                setMonitors(data.monitors);
            } else {
                console.error('Failed to fetch monitors:', data);
            }
            setLoading(false);
        };

        fetchMonitors();
    }, []);

    return (
        <>
            <PulseTitleBanner
                title="Status"
                text="Check the status of our services and any ongoing maintenance."
            />
            <motion.section className="py-16 bg-dark">
                <div className="px-4 mx-auto max-w-screen-xl">
                    {loading ? (
                        <Skeleton count={10} />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {monitors.map((monitor) => (
                                <div key={monitor.id} className="p-6 relative shadow bg-dark_gray hover:bg-black_secondary rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
                                    <h2 className="text-2xl font-bold text-white mb-4">{monitor.name}</h2>
                                    <div className="mb-4">
                                        <p className="text-sm text-white">Status: <span className={`${monitor.uptime_status === 'up' ? 'bg-clip-text text-transparent bg-status-card-text' : 'text-red-500'}`}>
                                            {monitor.uptime_status === 'up' ? 'ONLINE' : 'OFFLINE'}
                                        </span></p>
                                        <p className="text-sm text-white">Uptime: <span className="text-white/50">{monitor.uptime}%</span></p>
                                        <p className="text-sm text-white">Location: <span className="text-white/50">{monitor.resolve_address_info.City}, {monitor.resolve_address_info.Country}</span></p>
                                    </div>
                                    <div className="bg-dark rounded-lg py-2 px-2">
                                        <h3 className="text-lg font-bold text-white mb-2">Locations</h3>
                                        <div className="flex">
                                            {Object.entries(monitor.locations).map(([location, details]) => (
                                                <p key={location} className="text-sm text-white mb-1 ">
                                                    {location}: <span className="bg-clip-text text-transparent bg-status-card-text">{details.response_time}ms</span>
                                                </p>
                                            ))}
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