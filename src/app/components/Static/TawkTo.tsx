"use client";
import { useEffect } from "react";

declare global {
    interface Window {
        Tawk_API?: {
            hide: () => void;
            show: () => void;
            onLoad: () => void;
        };
    }
}

const TawkToChat = () => {
    useEffect(() => {
        if (typeof window !== "undefined" && !window.Tawk_API) {
            const script = document.createElement("script");
            script.src = process.env.TAWK_TO_EMBED_URL as string;
            script.async = true;
            script.onload = () => {
                if (window.Tawk_API) {
                    window.Tawk_API.onLoad = function () {
                        console.log("Tawk.to is ready!");
                    };
                }
            };

            document.body.appendChild(script);
        }
    }, []);

    return null;
};

export default TawkToChat;