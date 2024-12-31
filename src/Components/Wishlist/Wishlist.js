import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../Urls/Urls';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const [loading, setLoading] = useState(true);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishRemove, setWishRemove] = useState({});

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const wishData = await axios.get(`${BASE_URL}/wishlist`, { withCredentials: true });
                setWishlistItems(wishData.data.wishlistItems);
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    const toggleWishlist = (event, productId) => {
        event.preventDefault();
        event.stopPropagation();

        setWishRemove((prev) => ({ ...prev, [productId]: true }));

        axios
            .get(`${BASE_URL}/add-to-Wishlist/${productId}`, { withCredentials: true })
            .then((response) => {
                if (response.data.status) {
                    setWishlistItems((prevItems) =>
                        prevItems.filter((item) => item.product._id !== productId)
                    );
                }
            })
            .catch((error) => {
                console.error('Error removing from wishlist:', error);
            })
            .finally(() => {
                setWishRemove((prev) => ({ ...prev, [productId]: false }));
            });
    };

    return (
        <section className=" min-h-screen py-8 bg-gray-100 dark:bg-gray-800 ">
            <div className="container mx-auto ">
                <h2 className="text-center text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    Wishlist
                </h2>
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {wishlistItems.map((item) => (
                            <div
                                key={item.product._id}
                                className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative"
                            >
                                <button
                                    className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                                    onClick={(event) => toggleWishlist(event, item.product._id)}
                                >
                                    {wishRemove[item.product._id] ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        'X'
                                    )}
                                </button>
                                <Link to={`/product/${item.product._id}`} key={item.product._id}>

                                <img
                                    className="h-64 w-full object-cover"
                                    src={item.product.thumbnailImage}
                                    alt={item.product.Name}
                                />

                                <div className="p-4">
                                    <h5 className="font-bold text-lg text-gray-800 dark:text-gray-100 truncate">
                                        {item.product.Name}
                                    </h5>
                                    <p className="text-gray-600 dark:text-gray-300">Rs: {item.product.Price}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                        {item.product.Description}
                                    </p>
                                    {item.product.Quantity < 1 ? (
                                        <p className="text-red-500 font-bold">Stock out</p>
                                    ) : item.product.Quantity < 5 ? (
                                        <p className="text-yellow-500 font-bold">Only {item.product.Quantity} left!</p>
                                    ) : null}
                                </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-lg text-gray-600 dark:text-gray-400">
                        Your wishlist is empty!
                    </p>
                )}
            </div>
        </section>
    );
};

export default Wishlist;
