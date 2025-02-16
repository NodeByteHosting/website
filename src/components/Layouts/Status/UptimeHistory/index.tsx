import React from 'react';
import { ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface UptimeHistoryProps {
    data: any[]; // Adjust the type based on your data structure
}

const UptimeHistory: React.FC<UptimeHistoryProps> = ({ data }) => {
    return (
        <div>
            <h3 className="text-xl font-bold mb-6 text-gray-100">Uptime Overview</h3>
            <div className="h-[500px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            bottom: 20,
                            left: 20,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis yAxisId="left" stroke="#9CA3AF" />
                        <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#111827',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                            }}
                        />
                        <Legend />
                        <Area
                            yAxisId="left"
                            dataKey="uptime"
                            fill="#42d392"
                            stroke="#42d392"
                            fillOpacity={0.3}
                        />
                        <Bar
                            yAxisId="right"
                            dataKey="responseTime"
                            fill="#2C74B3"
                            radius={[4, 4, 0, 0]}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="downtime"
                            stroke="#ef4444"
                            strokeWidth={2}
                            dot={{ fill: '#ef4444' }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default UptimeHistory;