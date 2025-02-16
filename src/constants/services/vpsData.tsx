import { DataCard, DataItem } from "types/services";
import { VPS_FAQ } from "./vpsFaqs";

import {
    Cpu,
    Shield,
    HardDrive,
    MemoryStick,
    Globe,
    Settings,
    LineChart
} from "lucide-react";

export const VPS_DATA_ITEMS_MARQUEE: DataItem[] = [
    { title: "Ubuntu" },
    { title: "Debian" },
    { title: "CentOS" },
    { title: "Fedora" },
    { title: "Windows Server" },
];

export const VPS_DATA_CARDS: DataCard[] = [
    {
        faqs: VPS_FAQ,
        title: "Basic",
        price: "$9.44 USD",
        location: "Newcastle",
        link: "https://billing.nodebyte.host/store/vps-hosting",
        featuresBrief: [
            { text: "AMD Processor", icon: <Cpu /> },
            { text: "DDR4 RAM", icon: <MemoryStick /> },
            { text: "FyfeWeb DDOS", icon: <Shield /> },
            { text: "SSD Storage", icon: <HardDrive /> },
            { text: "Intuitive Panel", icon: <Settings /> },
            { text: "99.6% Uptime", icon: <LineChart /> },
        ],
        featuresFull: [
            { text: "2 vCPU Core AMD Ryzen™ 9 5900X", icon: <Cpu /> },
            { text: "4 Gigabytes of DDR4 RAM", icon: <MemoryStick /> },
            { text: "FyfeWeb DDoS Protection", icon: <Shield />, link: "https://fyfeweb.com/our-network" },
            { text: "40GB NVMe Solid State Drive", icon: <HardDrive /> },
            { text: "1GB/s Network Speeds", icon: <Globe /> },
            { text: "Virtualizor Control Panel ", icon: <Settings /> },
        ],
        marqueeItems: [...VPS_DATA_ITEMS_MARQUEE],
        outOfStock: false,
        stockCount: 9,
        limitedQuantity: true,
        limitedTime: false,
        recommended: false,
        featured: false
    },
    {
        faqs: VPS_FAQ,
        title: "Advanced",
        price: "$18.89 USD",
        location: "TBD",
        link: "https://billing.nodebyte.host/store/vps-hosting",
        featuresBrief: [
            { text: "AMD Processor", icon: <Cpu /> },
            { text: "DDR4 RAM", icon: <MemoryStick /> },
            { text: "FyfeWeb DDOS", icon: <Shield /> },
            { text: "SSD Storage", icon: <HardDrive /> },
            { text: "Intuitive Panel", icon: <Settings /> },
            { text: "99.6% Uptime", icon: <LineChart /> },
        ],
        featuresFull: [
            { text: "4 vCPU Core AMD Ryzen™ 9 5900X", icon: <Cpu /> },
            { text: "8 Gigabytes of DDR4 RAM", icon: <MemoryStick /> },
            { text: "FyfeWeb DDoS Protection", icon: <Shield />, link: "https://fyfeweb.com/our-network" },
            { text: "80GB NVMe Solid State Drive", icon: <HardDrive /> },
            { text: "1GB/s Network Speeds", icon: <Globe /> },
            { text: "Virtualizor Control Panel ", icon: <Settings /> },
        ],
        marqueeItems: [...VPS_DATA_ITEMS_MARQUEE],
        comingSoon: true,
        outOfStock: false,
        limitedQuantity: false,
        limitedTime: false,
        recommended: false,
        featured: false
    },
    {
        faqs: VPS_FAQ,
        title: "Pro",
        price: "$37.77 USD",
        location: "TBD",
        link: "https://billing.nodebyte.host/store/vps-hosting",
        featuresBrief: [
            { text: "AMD Processor", icon: <Cpu /> },
            { text: "DDR4 RAM", icon: <MemoryStick /> },
            { text: "FyfeWeb DDOS", icon: <Shield /> },
            { text: "SSD Storage", icon: <HardDrive /> },
            { text: "Intuitive Panel", icon: <Settings /> },
            { text: "99.6% Uptime", icon: <LineChart /> },
        ],
        featuresFull: [
            { text: "8 vCPU Core AMD Ryzen™ 9 5900X", icon: <Cpu /> },
            { text: "16 Gigabytes of DDR4 RAM", icon: <MemoryStick /> },
            { text: "FyfeWeb DDoS Protection", icon: <Shield />, link: "https://fyfeweb.com/our-network" },
            { text: "160GB NVMe Solid State Drive", icon: <HardDrive /> },
            { text: "1GB/s Network Speeds", icon: <Globe /> },
            { text: "Virtualizor Control Panel ", icon: <Settings /> },
        ],
        marqueeItems: [...VPS_DATA_ITEMS_MARQUEE],
        comingSoon: false,
        outOfStock: true,
        hideLocation: true,
        limitedQuantity: false,
        limitedTime: false,
        recommended: false,
        featured: false
    }
];