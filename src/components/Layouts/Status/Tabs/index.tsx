import { FC } from 'react';

interface TabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Tabs: FC<TabsProps> = ({ activeTab, setActiveTab }) => (
    <div className="flex flex-wrap justify-center mb-6 space-x-2 sm:space-x-4">
        {['Monitors', 'Statistics', 'Incidents'].map(tab => (
            <button
                key={tab}
                className={`px-4 py-2 text-lg font-semibold rounded ${activeTab === tab ? 'text-transparent bg-clip-text bg-gradient-to-br from-blue to-green underline' : 'text-white/70'}`}
                onClick={() => setActiveTab(tab)}
            >
                {tab}
            </button>
        ))}
    </div>
);

export default Tabs;