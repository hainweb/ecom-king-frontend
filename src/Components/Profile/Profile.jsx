import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import ProfileForm from "./ProfileForm";
import AddressManager from "./AddressManager";
import { ShoppingCart, Package, Heart, Bell } from 'lucide-react';
import PasswordChange from "./PasswordChange";
import ForgotPassword from "../Login/ForgotPassword";
import PasswordAndSecurity from "./PasswordAndSecurity";

const ProfilePage = ({ user }) => {
    const location = useLocation();
    const [view, setView] = useState(location.state?.view || "profile");
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    console.log('eredd', user);


    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center">

            <div className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 dark:from-blue-700 dark:via-blue-800 dark:to-blue-900 mt-36 sm:mt-20 md:mt-20">
                <div
                    className={`relative py-4 px-6 transition-all duration-500 ease-out ${isExpanded ? 'pb-24' : ''}`}
                    onMouseEnter={() => setIsExpanded(true)}
                    onMouseLeave={() => setIsExpanded(false)}
                >
                    {/* Main Content Row */}
                    <div className="flex items-center justify-between">
                        {/* Greeting */}
                        <div className="flex items-center space-x-2">
                            <span className="font-semibold text-white/90">Welcome back,</span>
                            <span className="font-bold text-white">{user.Name}</span>
                        </div>

                        {/* Interactive Icons */}
                        <div className="flex items-center space-x-6">
                            {/* Notifications */}
                            <button className="relative group">
                                <Bell className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
                                    0
                                </span>
                            </button>

                            {/* Wishlist */}
                            <Link to='/wishlist'>
                                <button className="relative group">

                                    <Heart className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />

                                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        Wishlist
                                    </span>

                                </button>
                            </Link>

                            {/* Cart */}
                            <Link to='/cart'>
                                <button className="relative group">

                                    <ShoppingCart className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />

                                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        Cart
                                    </span>

                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Expandable Content */}
                    <div
                        className={`absolute left-0 right-0 px-6 transition-all duration-500 ease-out overflow-hidden ${isExpanded ? 'opacity-100 translate-y-4' : 'opacity-0 translate-y-0 pointer-events-none'
                            }`}
                    >
                        {/* Recent Orders Preview */}
                        <div className="flex items-center justify-between p-4 bg-white/20 rounded-lg backdrop-blur-sm shadow-lg">
                            <div className="flex items-center space-x-3">
                                <Package className="w-6 h-6 text-white/90 hover:text-white transition-colors" />
                                <div className="text-sm">
                                    <p className="text-white font-semibold">Order Your Favorite Product</p>
                                    <p className="text-white/70">We provide great results with quick delivery!</p>
                                </div>
                            </div>
                            <Link to='/'>
                                <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 border border-transparent rounded-full shadow-md transition-all duration-200 ease-in-out transform hover:scale-105">
                                    Order Now
                                </button>
                            </Link>
                        </div>


                    </div>

                    {/* Animated Border */}
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </div>
            </div>

            <div className="w-full max-w-5xl bg-white dark:bg-gray-800 shadow-md mt-8 p-6 rounded-md">
                <div className="flex">
                    <Sidebar
                        view={view}
                        setView={setView}
                        isMobileNavOpen={isMobileNavOpen}
                        setIsMobileNavOpen={setIsMobileNavOpen}
                    />

                    <div className="w-full sm:w-3/4 pl-0 sm:pl-4">

                        {view === "profile" && <ProfileForm user={user} />}
                        {(view === "manageAddress" || view === "addAddress") && (
                            <AddressManager view={view} setView={setView} user={user} />
                        )}
                        {(view === "PasswordAndSecurity") && (
                            <PasswordAndSecurity user={user} view={view} setView={setView} />
                        )}
                        {(view === "PasswordChange") && (
                            <PasswordChange user={user} view={view} setView={setView} />
                        )}
                        {(view === "forgot") && (
                            <ForgotPassword user={user} view={view} setView={setView} loginedUser={user} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;