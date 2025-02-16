import { cn } from "tailwind";

interface PartyPopperProps {
    size?: number;
    className?: string;
}

const PartyPopper: React.FC<PartyPopperProps> = ({ size = 24, className }) => {
    return (
        <div className={cn("relative", className)} style={{ width: size, height: size }}>
            {/* Base popper */}
            <div className="absolute inset-0 animate-pop">
                🎉
            </div>

            {/* Confetti pieces */}
            <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => {
                    const tx = Math.random() * 100 - 50; // Random X translation
                    const ty = -(Math.random() * 100 + 50); // Random upward Y translation
                    const rotation = Math.random() * 360; // Random rotation

                    return (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-confetti"
                            style={{
                                left: '50%',
                                top: '50%',
                                animationDelay: `${i * 0.1}s`,
                                '--tx': `${tx}px`,
                                '--ty': `${ty}px`,
                                '--r': `${rotation}deg`,
                            } as React.CSSProperties}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default PartyPopper;