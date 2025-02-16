'use client';
import React, { useState } from "react";
import { ButtonGradient } from "ui/Button/ButtonGradient";
import { cn } from "tailwind";
import AnimatedPrice from "components/UI/AnimatedPrice";
import ServerInfoModal from "ui/ServerInfo";
import { Feature, DataCard, ServerInfoModalProps } from "types/services";
import { formatLocation, getLocationFlag } from "consts/formatLocation";
import { AlertTriangle, MapPin } from "lucide-react";
import AnimatedPartyPopper from "ui/PartyPopper";

interface ServiceCardProps extends DataCard {
    borderRadius?: string;
    className?: string;
    containerClassName?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
    title,
    price,
    location,
    featuresBrief,
    featuresFull,
    link,
    borderRadius = "1rem",
    className,
    containerClassName,
    recommended = false,
    featured = false,
    limitedTime = false,
    limitedQuantity = false,
    hideLocation = false,
    stockCount = 0,
    outOfStock = false,
    comingSoon = false,
    faqs,
    marqueeItems,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const modalProps: Omit<ServerInfoModalProps, 'isOpen' | 'onClose'> = {
        title,
        features: featuresFull,
        faqs,
        marqueeItems
    };

    return (
        <div
            className={cn(
                "relative w-full max-w-md mx-auto shadow-xl rounded-xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 border border-slate-700",
                containerClassName
            )}
            style={{ borderRadius }}
        >
            {/* Status Ribbons */}
            <div className="absolute top-0 left-0 w-full px-3 py-2 z-20">
                <div className="flex justify-between">
                    {/* Location Badge - Left Side */}
                    {!hideLocation && (
                        <div className="flex flex-col gap-2">
                            <div className="bg-slate-800/80 text-white text-xs font-bold px-3 py-1 rounded-md shadow-lg flex items-center gap-2">
                                {(!location || location === "TBD" || location === "TBA") ? (
                                    <>
                                        <MapPin size={14} className="text-slate-400" />
                                        <span>
                                            {!location || location === "TBD" ? "To Be Decided" : "To Be Announced"}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        {getLocationFlag(location)}
                                        {formatLocation(location)}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col gap-2 items-end">
                        {recommended && (
                            <div className="bg-gradient-to-br from-blue to-green text-white text-xs font-bold px-3 py-1 rounded-md shadow-lg">
                                Recommended
                            </div>
                        )}
                        {featured && (
                            <div className="bg-gradient-to-br from-green to-blue text-white text-xs font-bold px-3 py-1 rounded-md shadow-lg">
                                Featured
                            </div>
                        )}
                        {limitedQuantity && (
                            <div className="bg-gradient-to-br from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-md shadow-lg">
                                {stockCount && stockCount > 0 ? `${stockCount} Available` : "Limited Stock"}
                            </div>
                        )}
                        {limitedTime && (
                            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-md shadow-lg">
                                Limited Time
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Red tint overlay for out of stock */}
            {outOfStock && (
                <div className="absolute inset-0 bg-red-900/5 z-[1]" />
            )}

            {/* Card Content with Conditional Blur */}
            <div className={cn(
                "relative p-8 flex flex-col items-center text-white transition-all duration-300",
                outOfStock && "blur-2xl pointer-events-none [&>*]:text-red-400/50 bg-opacity-50 bg-red-500/20",
                comingSoon && "blur-2xl pointer-events-none"
            )}>
                {/* Title */}
                <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue to-green text-center">
                    {title}
                </h3>

                {/* Price Section */}
                <div className="mt-4 text-center">
                    <p className="text-white/50 text-sm">Starting at</p>
                    <AnimatedPrice basePrice={price} />
                    <p className="text-white/50 text-sm">per month</p>
                </div>

                {/* Features List */}
                <ul className="mt-6 w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                    {featuresBrief.map((feature: Feature, i) => (
                        <li key={i} className="flex items-center space-x-3">
                            <div className="text-blue-400">{feature.icon}</div>
                            {feature.link ? (
                                <a href={feature.link} className="text-white/75 underline">
                                    {feature.text}
                                </a>
                            ) : (
                                <p className="text-white/75">{feature.text}</p>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Call-to-Action Buttons */}
                <div className="w-full mt-6 flex space-x-4">
                    <ButtonGradient
                        radius="lg"
                        size="lg"
                        value={outOfStock ? "Out of Stock" : "Grab one now!"}
                        href={!outOfStock ? link : undefined}
                        className={cn(
                            "w-full",
                            outOfStock && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={outOfStock ? undefined : undefined}
                    />
                    <ButtonGradient
                        radius="lg"
                        size="lg"
                        value="More Info"
                        onClick={openModal}
                        className="w-full"
                    />
                </div>
            </div>

            {/* Out of Stock Overlay */}
            {outOfStock && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-900/50">
                    <div className="bg-gradient-to-br from-red-600 to-red-700 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 transform -rotate-12">
                        <AlertTriangle size={24} />
                        <span className="text-lg font-bold">Out of Stock</span>
                    </div>
                </div>
            )}

            {/* Coming Soon Overlay */}
            {comingSoon && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-900/50">
                    <div className="bg-gradient-to-br from-blue to-green text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 transform -rotate-12">
                        <AnimatedPartyPopper size={24} />
                        <span className="text-lg font-bold">Coming Soon</span>
                    </div>
                </div>
            )}

            {/* Server Info Modal */}
            <ServerInfoModal
                isOpen={isModalOpen}
                onClose={closeModal}
                {...modalProps}
            />
        </div>
    );
};

export default ServiceCard;