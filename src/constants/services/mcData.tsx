import { Feature, DataCard, DataItem } from "types/services"
import { MINECRAFT_FAQ } from "./mcFaqs";

import {
    Cpu,
    Database,
    Shield,
    HardDrive,
    MemoryStick,
    Globe,
    Settings,
    PlugIcon,
    Settings2Icon
} from "lucide-react";

export const briefMinecraftFeatures: Feature[] = [
    { text: "AMD Processor", icon: <Cpu /> },
    { text: "DDR4 RAM", icon: <MemoryStick /> },
    { text: "SSD Storage", icon: <HardDrive /> },
    { text: "Intuitive Panel", icon: <Settings /> },
    { text: "Custom JARs", icon: <PlugIcon /> },
    {
        text: "FyfeWeb Net",
        icon: <Globe />,
        link: "https://fyfeweb.com /our-network"
    },
    { text: "10 Databases", icon: <Database /> },
    { text: "99.6% Uptime", icon: <Shield /> }
];

const marqueeItems: DataItem[] = [
    { title: "Purpur" },
    { title: "BungeeCord" },
    { title: "Forge" },
    { title: "Bedrock" },
    { title: "Paper" },
    { title: "NeoForge" }
];

export const MINECRAFT_DATA_CARDS: DataCard[] = [
    {
        faqs: MINECRAFT_FAQ,
        title: "Ember",
        price: "$5.04 USD",
        location: "Newcastle",
        featuresBrief: [...briefMinecraftFeatures],
        featuresFull: [
            { text: "AMD Ryzen™ 9 5900X", icon: <Cpu /> },
            { text: "4 Gigabytes of DDR4 RAM", icon: <MemoryStick /> },
            {
                text: "FyfeWeb DDoS Protection",
                icon: <Shield />,
                link: "https://fyfeweb.com /our-network"
            },
            { text: "40GB NVMe Solid State Drive", icon: <HardDrive /> },
            { text: "1GB/s Network Speeds", icon: <Globe /> },
            { text: "Pterodactyl Control Panel ", icon: <Settings2Icon /> },
            { text: "Automatic/Pre-Installed JARs", icon: <PlugIcon /> },
            { text: "10 MySQL Databases", icon: <Database /> },
            { text: "99.6% Uptime SLA", icon: <Shield /> }
        ],
        marqueeItems: [...marqueeItems],
        link: "https://billing.nodebyte.host/store/minecraft-server-hosting",
        outOfStock: false,
        limitedQuantity: false,
        limitedTime: false,
        recommended: false,
        featured: false
    },
    {
        faqs: MINECRAFT_FAQ,
        title: "Blaze",
        price: "$7.55 USD",
        location: "Newcastle",
        featuresBrief: [...briefMinecraftFeatures],
        featuresFull: [
            { text: "AMD Ryzen™ 9 5900X", icon: <Cpu /> },
            { text: "6 Gigabytes of DDR4 RAM", icon: <MemoryStick /> },
            {
                text: "FyfeWeb DDoS Protection",
                icon: <Shield />,
                link: "https://fyfeweb.com /our-network"
            },
            { text: "60GB NVMe Solid State Drive", icon: <HardDrive /> },
            { text: "1GB/s Network Speeds", icon: <Globe /> },
            { text: "Pterodactyl Control Panel ", icon: <Settings2Icon /> },
            { text: "Automatic/Pre-Installed JARs", icon: <PlugIcon /> },
            { text: "10 MySQL Databases", icon: <Database /> },
            { text: "99.6% Uptime SLA", icon: <Shield /> }
        ],
        marqueeItems: [...marqueeItems],
        link: "https://billing.nodebyte.host/store/minecraft-server-hosting",
        outOfStock: false,
        limitedQuantity: false,
        limitedTime: false,
        recommended: false,
        featured: false,
    },
    {
        faqs: MINECRAFT_FAQ,
        title: "Inferno",
        price: "$9.44 USD",
        location: "Newcastle",
        featuresBrief: [...briefMinecraftFeatures],
        featuresFull: [
            { text: "AMD Ryzen™ 9 5900X", icon: <Cpu /> },
            { text: "8 Gigabytes of DDR4 RAM", icon: <MemoryStick /> },
            {
                text: "FyfeWeb DDoS Protection",
                icon: <Shield />,
                link: "https://fyfeweb.com /our-network"
            },
            { text: "80GB NVMe Solid State Drive", icon: <HardDrive /> },
            { text: "1GB/s Network Speeds", icon: <Globe /> },
            { text: "Pterodactyl Control Panel ", icon: <Settings2Icon /> },
            { text: "Automatic/Pre-Installed JARs", icon: <PlugIcon /> },
            { text: "10 MySQL Databases", icon: <Database /> },
            { text: "99.6% Uptime SLA", icon: <Shield /> }
        ],
        marqueeItems: [...marqueeItems],
        link: "https://billing.nodebyte.host/store/minecraft-server-hosting",
        outOfStock: false,
        limitedQuantity: false,
        limitedTime: false,
        recommended: false,
        featured: true,
    },
    {
        faqs: MINECRAFT_FAQ,
        title: "Firestorm",
        price: "$18.89 USD",
        location: "Newcastle",
        featuresBrief: [...briefMinecraftFeatures],
        featuresFull: [
            { text: "AMD Ryzen™ 9 5900X", icon: <Cpu /> },
            { text: "16 Gigabytes of DDR4 RAM", icon: <MemoryStick /> },
            {
                text: "FyfeWeb DDoS Protection",
                icon: <Shield />,
                link: "https://fyfeweb.com /our-network"
            },
            { text: "160GB NVMe Solid State Drive", icon: <HardDrive /> },
            { text: "1GB/s Network Speeds", icon: <Globe /> },
            { text: "Pterodactyl Control Panel ", icon: <Settings2Icon /> },
            { text: "Automatic/Pre-Installed JARs", icon: <PlugIcon /> },
            { text: "10 MySQL Databases", icon: <Database /> },
            { text: "99.6% Uptime SLA", icon: <Shield /> }
        ],
        marqueeItems: [...marqueeItems],
        link: "https://billing.nodebyte.host/store/minecraft-server-hosting",
        outOfStock: false,
        limitedQuantity: false,
        limitedTime: false,
        recommended: false,
        featured: false,
    },
    {
        faqs: MINECRAFT_FAQ,
        title: "Phoenix",
        price: "$28.33 USD",
        location: "TBA",
        featuresBrief: [...briefMinecraftFeatures],
        featuresFull: [
            { text: "AMD Ryzen™ 9 5900X", icon: <Cpu /> },
            { text: "24 Gigabytes of DDR4 RAM", icon: <MemoryStick /> },
            {
                text: "FyfeWeb DDoS Protection",
                icon: <Shield />,
                link: "https://fyfeweb.com /our-network"
            },
            { text: "240GB NVMe Solid State Drive", icon: <HardDrive /> },
            { text: "1GB/s Network Speeds", icon: <Globe /> },
            { text: "Pterodactyl Control Panel ", icon: <Settings2Icon /> },
            { text: "Automatic/Pre-Installed JARs", icon: <PlugIcon /> },
            { text: "10 MySQL Databases", icon: <Database /> },
            { text: "99.6% Uptime SLA", icon: <Shield /> }
        ],
        marqueeItems: [...marqueeItems],
        link: "https://billing.nodebyte.host/store/minecraft-server-hosting",
        comingSoon: true,
        outOfStock: false,
        limitedQuantity: false,
        limitedTime: false,
        recommended: false,
        featured: false,
    },
    {
        faqs: MINECRAFT_FAQ,
        title: "Supernova",
        price: "$37.77 USD",
        location: "Newcastle",
        featuresBrief: [...briefMinecraftFeatures],
        featuresFull: [
            { text: "AMD Ryzen™ 9 5900X", icon: <Cpu /> },
            { text: "32 Gigabytes of DDR4 RAM", icon: <MemoryStick /> },
            {
                text: "FyfeWeb DDoS Protection",
                icon: <Shield />,
                link: "https://fyfeweb.com /our-network"
            },
            { text: "320GB NVMe Solid State Drive", icon: <HardDrive /> },
            { text: "1GB/s Network Speeds", icon: <Globe /> },
            { text: "Pterodactyl Control Panel ", icon: <Settings2Icon /> },
            { text: "Automatic/Pre-Installed JARs", icon: <PlugIcon /> },
            { text: "10 MySQL Databases", icon: <Database /> },
            { text: "99.6% Uptime SLA", icon: <Shield /> }
        ],
        marqueeItems: [...marqueeItems],
        link: "https://billing.nodebyte.host/store/minecraft-server-hosting",
        outOfStock: false,
        limitedQuantity: false,
        limitedTime: false,
        recommended: false,
        featured: false,
    }
];

export const MINECRAFT_DATA_ITEMS_MARQUEE: DataItem[] = [
    { title: "Purpur" },
    { title: "BungeeCord" },
    { title: "Forge" },
    { title: "Bedrock" },
    { title: "Paper" },
    { title: "NeoForge" }
];

