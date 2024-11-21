'use client';

import { motion } from "framer-motion";
import { signIn } from 'next-auth/react';
import { useState, FC } from 'react';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const Signin: FC = ({ }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const result: any = await signIn('credentials', {
            redirect: false,
            email,
            password
        });

        if (result.error) {
            toast.error('Login failed, please verify your credentials and try again.');
        } else {
            window.location.href = '/';
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <motion.section className="py-16 bg-dark">
                <div className="container mx-auto max-w-md mb-10">
                    <section className="rounded-lg">
                        <h1 className="text-3xl font-bold text-white mb-6">Sign In</h1>
                        <p className="text-white/50 mb-4">Welcome back! Sign in to your account to continue.</p>
                        <p className="text-white/50 text-xs" />
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-white">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    placeholder="demo@nodebyte.host"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-3 py-2 bg-black_secondary border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-white/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        placeholder="something secure"
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="mt-1 block w-full px-3 py-2 bg-black_secondary border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-white/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleShowPassword}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                                    >
                                        {showPassword ? <FaEyeSlash className="text-white" /> : <FaEye className="text-white/50" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    Sign In
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <a href="#" className="text-sm text-primary-600 hover:text-primary-500">
                                    Forgot your password?
                                </a>
                                <a href="#" className="text-sm text-primary-600 hover:text-primary-500">
                                    Sign Up
                                </a>
                            </div>
                        </form>
                    </section>
                </div>
            </motion.section>
        </>
    );
};