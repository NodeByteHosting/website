"use client";
import { useState } from "react";

const ChatButton = () => {
    const [isChatVisible, setChatVisible] = useState(true);

    const toggleChat = () => {
        if (typeof window !== "undefined" && window.Tawk_API) {
            if (isChatVisible) {
                window.Tawk_API.hide();
            } else {
                window.Tawk_API.show();
            }
            setChatVisible(!isChatVisible);
        }
    };

    return (
        <button onClick={toggleChat} className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full">
            {isChatVisible ? "Hide Chat" : "Show Chat"}
        </button>
    );
};

export default ChatButton;