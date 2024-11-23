'use client';
import { useState } from 'react';

const ExtraLinksDropdown = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="relative flex items-center space-x-4">
            <button
                className="text-white font-medium text-sm flex items-center space-x-2"
                onClick={toggleDropdown}
            >
                <span>{dropdownOpen ? "What's this?" : 'Portals'}</span>
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
                            href="https://billing.nodebyte.host"
                            target="_blank"
                            className="block px-4 py-2 text-white hover:text-blue"
                        >
                            Billing Portal
                        </a>
                        <a
                            href="https://panel.nodebyte.host"
                            target="_blank"
                            className="block px-4 py-2 text-white hover:text-blue"
                        >
                            Game Panel
                        </a>
                        <a
                            href="https://vps.nodebyte.host/"
                            target="_blank"
                            className="block px-4 py-2 text-white hover:text-blue"
                        >
                            VPS Panel
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExtraLinksDropdown;