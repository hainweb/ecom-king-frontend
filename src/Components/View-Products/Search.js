import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Moon,  Sun, Tag } from 'lucide-react';
import { Menu, MenuButton } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import { BASE_URL, IMG_URL } from '../Urls/Urls';

function UserHeader({ cartCount, user, setDarkMode, darkMode }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const toggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/products`, { withCredentials: true });
                setProducts(response.data.products);
            } catch (err) {
                console.error('Failed to load products:', err);
            }
        };
        fetchProducts();
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === '') {
            setFilteredProducts([]);
        } else {
            const filtered = products.filter(product =>
                product.Name.toLowerCase().includes(value.toLowerCase()) ||
                product.Category.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    };

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [darkMode]);

    const truncateText = (text, length) => {
        return text.length > length ? `${text.substring(0, length)}...` : text;
    }

    const calculateDiscount = (sellingPrice, price) => {
        return Math.round(((sellingPrice - price) / sellingPrice) * 100);
    }

    return (
        <>
            <header className={`fixed top-0 z-50 w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} shadow-xl transition-all ease-in-out`}>
                {/* Previous header code remains the same */}
                <nav className="navbar navbar-expand-lg navbar-light p-4 flex justify-between items-center max-w-screen-xl mx-auto">
                    <Link className="text-3xl font-bold text-blue-600 hover:text-blue-800 transition duration-200" to="/">
                        King Cart
                    </Link>

                    <ul className="hidden sm:flex navbar-nav space-x-8">
                        <li className="nav-item">
                            <Link className={`text-lg hover:text-blue-600 transition duration-300 ${darkMode ? 'text-white' : 'text-gray-700'}`} to="/cart">
                                <i className="fas fa-shopping-cart mr-2"></i>
                                Cart {user ? <span className="bg-blue-600 text-white rounded-full px-2 text-xs">{cartCount}</span> : ''}
                            </Link>
                        </li>
                    </ul>

                    <div className="hidden md:flex w-2/3 mx-8">
                        <input
                            type="text"
                            className="w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 shadow-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            placeholder="Search for a product..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            autoFocus
                        />
                    </div>

                    <div className="flex items-center space-x-6">
                        <button
                            onClick={toggleDarkMode}
                            className="w-9 h-9 bg-gray-700 text-white rounded-full hover:bg-gray-800 flex items-center justify-center p-1 overflow-hidden transition duration-300"
                        >
                            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                        </button>
                    </div>

                    <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <MenuButton
                                className={`inline-flex justify-center items-center p-2 rounded-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-sm ring-1 ring-gray-300 hover:bg-gray-50`}
                            >
                                <EllipsisVerticalIcon className="h-4 w-4" />
                            </MenuButton>
                        </div>

                        <Menu.Items
                            transition
                            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none"
                        >
                            <div className="py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block px-4 py-2 text-sm w-full text-left`}
                                            onClick={() => console.log('Download App clicked')}
                                        >
                                            Download App
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Menu>
                </nav>

                <div className="md:hidden fixed -mt-3 left-0 w-full bg-white dark:bg-gray-900 shadow-lg p-4">
                    <input
                        type="text"
                        className="w-full p-3 rounded-lg bg-gray-200 dark:bg-gray-700 shadow-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        placeholder="Search for a product..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        autoFocus
                    />
                </div>
                <div className="fixed top-18 mt-16 sm:mt-0 md:mt-0 left-0 w-full h-10 bg-transparent dark:bg-gradient-to-b dark:from-gray-900 dark:to-transparent pointer-events-none z-50"></div>

            </header>

            {searchTerm.trim() === '' ? (
                <div className={`fixed w-full min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center`}>
                    <p className={`text-2xl font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Search a product 
                    </p>
                    
                </div>
            ) : (
                
                <div className={`fixed w-full overflow-y-auto min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} mt-12 sm:mt-0 md:mt-0 transition-all duration-300`}
                    style={{ top: '70px', maxHeight: 'calc(100vh - 160px)', zIndex: 40 }}>
                    <div className="container mx-auto px-4 py-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <Link to={`/product/${product._id}`} key={product._id}>
                                        <div className={`rounded-lg shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-all duration-300 hover:shadow-xl`}>
                                            <div className="relative pt-[100%]">
                                                <img
                                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                                    alt={product.Name}
                                                    src={product.thumbnailImage}
                                                />
                                                {product.SellingPrice > product.Price && (
                                                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                                        <Tag className="w-3 h-3" />
                                                        {calculateDiscount(product.SellingPrice, product.Price)}% OFF
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                                    {truncateText(product.Name, 20)}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-blue-600 font-bold">₹{product.Price.toLocaleString()}</span>
                                                    {product.SellingPrice > product.Price && (
                                                        <span className="text-gray-500 line-through text-sm">
                                                            ₹{product.SellingPrice.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                                {product.Quantity < 1 && (
                                                    <p className="text-red-500 mt-2">Out of Stock</p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className={`col-span-full text-center py-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    No products found matching your search
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}

export default UserHeader;
