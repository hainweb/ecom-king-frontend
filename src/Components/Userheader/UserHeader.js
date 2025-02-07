import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import {
  CircleUserRound,
  House,
  Moon,
  Package2,
  ShoppingCart,
  Sun,
} from 'lucide-react'; // Import icons from lucide-react
import { Menu } from '@headlessui/react'; // Using Headless UI's Menu components
import { ChevronDownIcon } from '@heroicons/react/20/solid'; // Import Chevron icon
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'; // Import ellipsis icon

function UserHeader({ cartCount, user, darkMode, setDarkMode }) {
  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full ${
        darkMode
          ? 'bg-gray-900 text-white shadow-lg shadow-gray-800/100'
          : 'bg-white text-gray-800 shadow-lg shadow-gray-200/100'
      } transition-all ease-in-out`}
    >
      <nav className="navbar navbar-expand-lg navbar-light p-4 flex justify-between items-center max-w-screen-xl mx-auto">
        {/* Brand/logo */}
        <Link
          className="text-3xl font-bold text-blue-600 hover:text-blue-800 transition duration-200"
          to="/"
        >
          King Cart
        </Link>

        {/* Left-aligned items (Cart and Orders) */}
        <ul className="navbar-nav hidden sm:flex space-x-8">
          <li className="nav-item">
            <Link
              className={`text-lg hover:text-blue-600 transition duration-300 ${
                darkMode ? 'text-white' : 'text-gray-700'
              }`}
              to="/cart"
            >
              <i className="fas fa-shopping-cart mr-2"></i>
              Cart{' '}
              {user && (
                <span className="bg-blue-600 text-white rounded-full px-2 text-xs">
                  {cartCount}
                </span>
              )}
            </Link>
          </li>
        </ul>

        {/* Right-aligned user dropdown or login/logout */}
        <div className="flex hidden sm:flex items-center space-x-6">
          {user ? (
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button
                  className={`inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold ${
                    darkMode
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : 'bg-white text-gray-900 hover:bg-gray-50'
                  } shadow-sm ring-1 ring-inset ring-gray-300`}
                >
                  {user.Name}/Profile
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="-mr-1 w-5 h-5 text-gray-400"
                  />
                </Menu.Button>
              </div>

              <Menu.Items
                className={`absolute right-0 z-[60] mt-2 w-56 origin-top-right rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none ${
                  darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}
              >
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/profile"
                        className={`flex items-center px-4 py-2 text-sm ${
                          active
                            ? darkMode
                              ? 'bg-gray-700 text-white'
                              : 'bg-gray-100 text-gray-900'
                            : darkMode
                            ? 'text-white'
                            : 'text-gray-700'
                        }`}
                      >
                        <CircleUserRound className="w-4 h-4 mr-2" /> Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/orders"
                        className={`block px-4 py-2 text-sm ${
                          active
                            ? darkMode
                              ? 'bg-gray-700 text-white'
                              : 'bg-gray-100 text-gray-900'
                            : darkMode
                            ? 'text-white'
                            : 'text-gray-700'
                        }`}
                      >
                        Orders
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/wishlist"
                        className={`block px-4 py-2 text-sm ${
                          active
                            ? darkMode
                              ? 'bg-gray-700 text-white'
                              : 'bg-gray-100 text-gray-900'
                            : darkMode
                            ? 'text-white'
                            : 'text-gray-700'
                        }`}
                      >
                        Wishlist
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/logout"
                        className={`block px-4 py-2 text-sm ${
                          active
                            ? darkMode
                              ? 'bg-gray-700 text-white'
                              : 'bg-gray-100 text-gray-900'
                            : darkMode
                            ? 'text-white'
                            : 'text-gray-700'
                        }`}
                      >
                        Log Out
                      </Link>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>
          ) : (
            <Link to="/login">
              <button
                className={`px-6 py-2 rounded-full transition duration-300 border-2 border-solid ${
                  darkMode
                    ? 'text-white border-blue-500 hover:border-blue-600'
                    : 'text-black border-blue-500 hover:border-blue-700'
                }`}
              >
                Login / Sign Up
              </button>
            </Link>
          )}
        </div>

        {/* Search Icon */}
        <div>
          <Link to="/search">
            <span
              className="cursor-pointer flex items-center whitespace-nowrap rounded px-3 py-1.5 text-base font-normal text-neutral-700 dark:text-neutral-200"
              id="basic-addon2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </Link>
        </div>

        {/* Dark Mode Toggle Button */}
        <div
          onClick={toggleDarkMode}
          className="w-9 h-9 bg-gray-700 text-white rounded-full hover:bg-gray-800 flex items-center justify-center p-1 overflow-hidden transition duration-300 cursor-pointer"
        >
          {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </div>

        {/* Ellipsis Dropdown */}
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button
              className={`inline-flex justify-center items-center p-2 rounded-full ${
                darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-900 hover:bg-gray-50'
              } shadow-sm ring-1 ring-gray-300`}
            >
              <EllipsisVerticalIcon className="h-4 w-4" />
              
            </Menu.Button>
          </div>
          <Menu.Items
            className={`absolute right-0 z-[60] mt-2 w-48 origin-top-right rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}
          >
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => console.log('Download App clicked')}
                    className={`block px-4 py-2 text-sm w-full text-left rounded-md transition-colors duration-200 ease-in-out ${
                      active
                        ? darkMode
                          ? 'bg-gray-800 text-white hover:bg-gray-700'
                          : 'bg-gray-900 text-white hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Download App
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </nav>

      {/* Overlays */}
      <div className="fixed top-18 left-0 w-full h-8 bg-transparent dark:bg-gradient-to-b dark:from-gray-900 dark:to-transparent pointer-events-none z-50"></div>
      <div className="fixed bottom-16 mb-2 sm:mb-0 md:mb-0 left-0 w-full h-6 bg-gradient-to-b from-transparent to-white dark:from-transparent dark:to-gray-900 pointer-events-none z-50 sm:bottom-0"></div>

      {/* Bottom navigation for mobile view */}
      <nav
        className={`lg:hidden fixed bottom-0 left-0 w-full py-4 ${
          darkMode ? 'bg-gray-900 shadow-lg shadow-gray-800/100' : 'bg-white shadow-lg shadow-gray-200/100'
        }`}
      >
        <ul className="flex justify-around items-center">
          <li>
            <Link
              className={`flex flex-col items-center transition duration-300 ${
                darkMode ? 'text-white' : 'text-gray-700'
              } hover:text-blue-600`}
              to="/"
            >
              <House color={darkMode ? '#ffffff' : '#0d0d0d'} strokeWidth={2} />
              Home
            </Link>
          </li>
          <li>
            <Link
              className={`flex flex-col items-center transition duration-300 ${
                darkMode ? 'text-white' : 'text-gray-700'
              } hover:text-blue-600`}
              to="/cart"
            >
              <div className="relative">
                <ShoppingCart color={darkMode ? '#ffffff' : '#0d0d0d'} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full px-1 text-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              Cart
            </Link>
          </li>
          <li>
            <Link
              className={`flex flex-col items-center transition duration-300 ${
                darkMode ? 'text-white' : 'text-gray-700'
              } hover:text-blue-600`}
              to="/orders"
            >
              <Package2 color={darkMode ? '#ffffff' : '#0d0d0d'} />
              Orders
            </Link>
          </li>
          <li>
            <Link
              className={`flex flex-col items-center transition duration-300 ${
                darkMode ? 'text-white' : 'text-gray-700'
              } hover:text-blue-600`}
              to="/profile"
            >
              <CircleUserRound color={darkMode ? '#ffffff' : '#0d0d0d'} />
              Profile
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default UserHeader;
