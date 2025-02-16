'use client';
import { useState } from 'react';

const ServiceLinksDropdown = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="relative flex items-center space-x-4 mr-2">
            <button
                className="text-white font-medium text-sm flex items-center space-x-1"
                onClick={toggleDropdown}
            >
                <span>{dropdownOpen ? "They're pretty neat!" : 'Services'}</span>
                <svg
                    className="w-4 h-4 transform transition-transform"
                    style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {dropdownOpen && (
                <div className="absolute right-0 mt-52 w-48 bg-gradient-to-tl from-grey-900 via-dark_gray to-black rounded-md shadow-lg z-10">
                    <div className="py-2">
                        <a
                            href="/services/dedi"
                            className="block px-4 py-2 text-white hover:text-blue"
                        >
                            Dedicated Servers
                        </a>
                        <a
                            href="/services/mc"
                            className="block px-4 py-2 text-white hover:text-blue"
                        >
                            Minecraft Servers
                        </a>
                        <a
                            href="/services/vps"
                            className="block px-4 py-2 text-white hover:text-blue"
                        >
                            VPS Servers
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceLinksDropdown;