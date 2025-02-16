import { FC, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

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

interface IncidentsProps {
    monitors: Monitor[];
}

const Incidents: FC<IncidentsProps> = ({ monitors }) => (
    <div className="p-6 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {monitors.map((monitor) => (
                monitor.incidents && monitor.incidents.length > 0 && (
                    <IncidentCard key={monitor.id} monitor={monitor} />
                )
            ))}
        </div>
    </div>
);

const IncidentCard: FC<{ monitor: Monitor }> = ({ monitor }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="p-6 shadow-lg bg-no-repeat bg-center bg-cover bg-[url('/bgAnimDark.svg')] rounded-lg border border-blue/50 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{monitor.friendly_name} ({monitor.incidents?.length})</h3>
                <button onClick={() => setIsExpanded(!isExpanded)} className="text-xl">
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </button>
            </div>
            {isExpanded && (
                <div className="mb-4 bg-dark_gray p-4 rounded-lg">
                    {monitor.incidents?.map((incident, index) => (
                        <div key={index} className="mb-2">
                            <p className="text-sm">Incident Time: <span className="text-gray-400">{new Date(incident.datetime * 1000).toLocaleString()}</span></p>
                            <p className="text-sm">Type: <span className={`text-sm ${incident.type === 1 ? 'text-red-500' : 'text-green'}`}>{incident.type === 1 ? 'Down' : 'Up'}</span></p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Incidents;