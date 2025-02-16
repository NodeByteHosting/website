export interface Feature {
    text: string;
    icon: React.ReactNode;
    link?: string;
}

export interface DataCard {
    title: string;
    price: string;
    location: string;
    featuresBrief: Feature[];
    featuresFull: Feature[];
    link: string;
    hideLocation?: boolean;
    comingSoon?: boolean;
    outOfStock: boolean;
    limitedTime: boolean;
    limitedQuantity: boolean;
    stockCount?: number;
    recommended: boolean;
    featured: boolean;
    marqueeItems: { title: string }[];
    faqs: { question: string; answer: string; icon?: React.ReactNode }[];
}

export interface ServerInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    features: Feature[];
    faqs: { question: string; answer: string; icon?: React.ReactNode }[];
    marqueeItems: { title: string }[];
}

export interface DataItem {
    title: string;
}
