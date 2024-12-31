import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL, IMG_URL } from '../Urls/Urls';
import { useNavigate, useParams, Link } from 'react-router-dom';


const OrderTracking = ({ orderTrack, setOrderTrack }) => {
    const handleCancelOrder = async (orderId) => {
        try {
            const confirmCancel = window.confirm('Are you sure you want to cancel this order? This action cannot be undone.');
            if (!confirmCancel) return;

            const response = await axios.post(`${BASE_URL}/cancel-order`, { orderId }, { withCredentials: true });
            if (response.data.status) {
                setOrderTrack(response.data.orderTrack);
                alert(response.data.message || 'Order canceled successfully');
            }
        } catch (error) {
            console.error('Error canceling order:', error);
            alert('Failed to cancel the order');
        }
    };

    const isWithin8Hours = (orderDate) => {
        const now = new Date();
        const orderTime = new Date(orderDate);
        const diffInMs = now - orderTime;
        const diffInHours = diffInMs / (1000 * 60 * 60);
        return diffInHours >= 2;
    };

    return (
        <div className="container mx-auto my-12 p-6 bg-white shadow-lg rounded-lg">
            <h5 className="text-2xl font-semibold text-gray-700 mb-4">Ordered Products</h5>
            <div className="space-y-6">
                {orderTrack.map((track, index) => (
                    <div key={index} className="flex space-x-8">
                        <div className={`order-tracking p-4 ${track.status ? 'bg-green-100' : 'bg-gray-100'} rounded-lg`}>
                            <p className="font-medium text-gray-700">Ordered <br /><span className="text-sm text-gray-500">{track.date}</span></p>
                            {!track.canceled && (
                                <button
                                    className="mt-2 text-white bg-red-500 hover:bg-red-600 rounded-md px-4 py-2 text-sm"
                                    onClick={() => handleCancelOrder(track._id)}
                                    disabled={track.status2 || isWithin8Hours(track.date)}
                                >
                                    Cancel Order
                                </button>
                            )}
                        </div>

                        <div className={`order-tracking p-4 ${track.status2 ? 'bg-yellow-100' : 'bg-gray-100'} rounded-lg`}>
                            <p className="font-medium text-gray-700">Shipped</p>
                            {track.status2 && (
                                <p className="text-sm text-gray-500">Your product is shipped at {track.shippedDate}</p>
                            )}
                        </div>

                        <div className={`order-tracking p-4 ${track.status3 ? 'bg-blue-100' : 'bg-gray-100'} rounded-lg`}>
                            <p className="font-medium text-gray-700">Delivered</p>
                            {track.status3 && (
                                <p className="text-sm text-gray-500">Your product was delivered at {track.deliveredDate}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ProductCard = ({ products, orderTrack, setOrderTrack }) => {
    const [error, setError] = useState('');
    const { Id } = useParams();
    const navigate = useNavigate()

    const handleReturn = async (proId) => {
        const returndata = { proId: proId, orderId: Id, check: true };
        try {
            const response = await axios.post(`${BASE_URL}/return-product`, { returndata }, { withCredentials: true });

            if (response.data.status) {
                navigate(`/return?proId=${returndata.proId}&orderId=${returndata.orderId}`);
            } else {
                alert('Failed to return the product: ' + response.data.message);
            }
        } catch (error) {
            setError('Error returning the product: ' + error);
        }
    };

    return (
        <div className="w-full h-full bg-gradient-to-l from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 py-8 px-6">
            <div className="container mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Products</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => {
                        const { Name, Description, Price, thumbnailImage } = product.product || {};
                        return (
                            <Link to={`/product/${product._id}`} key={product._id}>
                                <div
                                    className="border rounded-lg p-4 shadow-lg hover:shadow-2xl transition-shadow duration-300 dark:bg-gray-800 max-w-xs mx-auto"
                                >
                                    {/* Full-size Image */}
                                    <img
                                        src={thumbnailImage || 'https://via.placeholder.com/150'} // Fallback image
                                        alt={Name || 'Product Name'}
                                        className="w-full h-auto object-cover rounded-md mb-4"
                                    />

                                    {/* Truncated Name */}
                                    <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-2 line-clamp-1">
                                        {Name || 'No name available'}
                                    </h2>

                                    {/* Truncated Description */}
                                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                        {Description || 'No description available.'}
                                    </p>

                                    <div className="text-lg font-bold text-blue-500">
                                        Rs: {Price || 'N/A'}
                                    </div>

                                    {orderTrack.some((track) => track.status3) &&
                                        product.product?.Return &&
                                        !product.return?.status && (
                                            <button
                                                className="mt-4 w-full py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
                                                onClick={() => handleReturn(product.product._id)}
                                            >
                                                Return
                                            </button>
                                        )}
                                </div>
                            </Link>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

const OrderPage = () => {
    const { Id } = useParams(); // Get the order Id from the URL
    const [orderTrack, setOrderTrack] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/view-orders-products/${Id}`, {
                    withCredentials: true,
                });
                console.log('view ordered pro',response.data.products);

                setProducts(response.data.products);
                setOrderTrack(response.data.ordertrack);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching order details:', error);
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [Id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <section>
            <OrderTracking orderTrack={orderTrack} setOrderTrack={setOrderTrack} />
            <ProductCard products={products} orderTrack={orderTrack} />
        </section>
    );
};

export default OrderPage;
