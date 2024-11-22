'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { ButtonGradient } from '../../UI/Button/ButtonGradient';

const AuthStatus = () => {
    const { data: session, status } = useSession();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // if (status === 'authenticated') {
    //     return (
    //         <div className="relative flex items-center space-x-4">
    //             <img
    //                 src={'/default_user.png'}
    //                 alt="User Avatar"
    //                 className="w-8 h-8 rounded-full"
    //             />
    //             <button
    //                 onClick={toggleDropdown}
    //                 className="text-white focus:outline-none"
    //             >
    //                 {session.user?.firstName} {session.user?.lastName}
    //             </button>
    //             {dropdownOpen && (
    //                 <div className="absolute right-0 mt-52 w-48 bg-gradient-to-tl from-grey-900 via-dark_gray to-black rounded-md shadow-lg z-10">
    //                     <div className="py-2">
    //                         <a
    //                             href="/profile"
    //                             className="block px-4 py-2 text-white hover:text-blue"
    //                         >
    //                             Profile
    //                         </a>
    //                         <a
    //                             href="https://billing.nodebyte.host" target='_blank'
    //                             className="block px-4 py-2 text-white hover:text-blue"
    //                         >
    //                             Billing Portal
    //                         </a>
    //                         <a
    //                             href="/settings"
    //                             className="block px-4 py-2 text-white hover:text-blue"
    //                         >
    //                             Settings
    //                         </a>
    //                         <button
    //                             onClick={() => signOut()}
    //                             className="block w-full text-left px-4 py-2 text-white hover:text-blue"
    //                         >
    //                             Sign Out
    //                         </button>
    //                     </div>
    //                 </div>
    //             )}
    //         </div>
    //     );
    // }

    // return (
    //     <ButtonGradient
    //         radius="full"
    //         size="md"
    //         className="s.Button"
    //         value="Login/Sign Up"
    //         href="/auth/signin"
    //     />
    // );


    // Using this until the login parts are done 100%
    return (
            <div className="relative flex items-center space-x-4">
                <button
                    className="text-white font-medium flex items-center space-x-2"
                    onClick={toggleDropdown}
                >
                    <span>Login</span>
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

export default AuthStatus;