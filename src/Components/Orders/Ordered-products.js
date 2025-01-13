import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../Urls/Urls';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, Truck, Package, XCircle, ArrowLeft, Clock } from 'lucide-react';

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
        <div className="mx-auto bg-white dark:bg-gray-800 shadow-xl p-6 mt-12">
            <div className="container mx-auto bg-white dark:bg-gray-800 p-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-8 transition-colors duration-300">
                    <div className="space-y-12">
                        {orderTrack.map((track, index) => (
                            <div key={index} className="relative">
                                <div className="flex justify-between items-center">
                                    {/* Connecting Lines Container */}
                                    <div className="absolute top-6 left-[15%] right-[15%] h-0.5 z-0">
                                        <div className={`h-full relative overflow-hidden bg-gray-200 dark:bg-gray-700 transition-all duration-700`}>
                                            <div className={`absolute top-0 left-0 h-full bg-green-500 transition-all duration-1000 ease-in-out ${track.status ? 'w-1/2' : 'w-0'} ${track.status2 ? 'w-full' : ''}`} />
                                        </div>
                                    </div>

                                    {/* Order Placed */}
                                    <div className="flex-1 relative z-10">
                                        <div className={`flex flex-col items-center transition-all duration-500 ease-in-out ${track.status ? 'opacity-100' : 'opacity-50'}`}>
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 transform ${track.status ? 'bg-green-500 dark:bg-green-400 scale-110 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                                <Clock className={`w-6 h-6 transition-all duration-500 ${track.status ? 'text-white animate-spin-slow' : 'text-gray-600 dark:text-gray-400'}`} />
                                            </div>
                                            <div className="mt-4 text-center">
                                                <p className={`font-semibold transition-colors duration-500 ${track.status ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                    Ordered
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 animate-fade-in">{track.date}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shipped */}
                                    <div className="flex-1 relative z-10">
                                        <div className={`flex flex-col items-center transition-all duration-500 ease-in-out ${track.status2 ? 'opacity-100' : 'opacity-50'}`}>
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 transform ${track.status2 ? 'bg-green-500 dark:bg-green-400 scale-110 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                                <Truck className={`w-6 h-6 transition-all duration-500 ${track.status2 ? 'text-white animate-truck' : 'text-gray-600 dark:text-gray-400'}`} />
                                            </div>
                                            <div className="mt-4 text-center">
                                                <p className={`font-semibold transition-colors duration-500 ${track.status2 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                    Shipped
                                                </p>
                                                {track.status2 && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 animate-fade-in">{track.shipedDate}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delivered */}
                                    <div className="flex-1 relative z-10">
                                        <div className={`flex flex-col items-center transition-all duration-500 ease-in-out ${track.status3 ? 'opacity-100' : 'opacity-50'}`}>
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 transform ${track.status3 ? 'bg-green-500 dark:bg-green-400 scale-110 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                                <Package className={`w-6 h-6 transition-all duration-500 ${track.status3 ? 'text-white animate-bounce' : 'text-gray-600 dark:text-gray-400'}`} />
                                            </div>
                                            <div className="mt-4 text-center">
                                                <p className={`font-semibold transition-colors duration-500 ${track.status3 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                    Delivered
                                                </p>
                                                {track.status3 && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 animate-fade-in">{track.deliveredDate}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cancel Order Overlay */}
                                    {track.cancel && (
                                        <div className="absolute inset-0 bg-red-50 dark:bg-red-900/20 rounded-lg transition-all duration-500 z-20 backdrop-blur-sm">
                                            <div className="flex flex-col items-center justify-center h-full animate-fade-in">
                                                <XCircle className="w-12 h-12 text-red-500 dark:text-red-400 animate-bounce" />
                                                <p className="mt-2 text-red-600 dark:text-red-400 font-semibold">Order Canceled</p>
                                                <p className="text-sm text-red-500 dark:text-red-400">{track.canceledTime}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Cancel Button */}
                                {!track.cancel && !track.status2 && (
                                    <div className="flex justify-center mt-6">
                                        <button
                                            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 transform ${isWithin8Hours(track.date) ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700 hover:shadow-lg dark:hover:shadow-red-700/25 hover:-translate-y-0.5 active:translate-y-0'}`}
                                            onClick={() => handleCancelOrder(track._id)}
                                            disabled={track.status2 || isWithin8Hours(track.date)}
                                        >
                                            Cancel Order
                                        </button>
                                    </div>
                                )}

                                {index < orderTrack.length - 1 && (
                                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-8" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @keyframes truck {
                    0% { transform: translateX(-10px); }
                    50% { transform: translateX(10px); }
                    100% { transform: translateX(-10px); }
                }

                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }

                .animate-truck {
                    animation: truck 2s ease-in-out infinite;
                }

                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

const ProductCard = ({ products, orderTrack }) => {
    const [error, setError] = useState('');
    const { Id } = useParams();
    const navigate = useNavigate();

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
                <div className="grid grid-cols-1 mb-16 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <div className="relative">
                                <img
                                    src={product.product?.thumbnailImage || '/api/placeholder/400/300'}
                                    alt={product.product?.Name}
                                    className="w-full h-full object-cover"
                                />
                                {product.return?.status && (
                                    <div className="absolute inset-0 bg-yellow-500 bg-opacity-90 flex items-center justify-center">
                                        <div className="text-center text-white p-4">
                                            <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
                                            <p className="font-bold">Return Requested</p>
                                            <p className="text-sm">{product.return.date}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-2 line-clamp-1">
                                    {product.product?.Name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {product.product?.Description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold text-blue-600">
                                        ₹{product.product?.Price}
                                    </span>
                                    {orderTrack.some(track => track.status3) && product.product?.Return && !product.return?.status && (
                                        <button
                                            onClick={() => handleReturn(product.product._id)}
                                            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                                        >
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Return
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const OrderPage = () => {
    const [orderTrack, setOrderTrack] = useState([]);
    const [products, setProducts] = useState([]);
    const { Id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/view-orders-products/${Id}`, {
                    withCredentials: true,
                });
                console.log('view ordered pro',response.data.products);

                setProducts(response.data.products);
                setOrderTrack(response.data.ordertrack);
              
            } catch (error) {
                console.error('Error fetching order details:', error);
               
            }
        };

        fetchData();
    }, [Id]);

    return (
        <>
            <OrderTracking orderTrack={orderTrack} setOrderTrack={setOrderTrack} />
            <ProductCard products={products} orderTrack={orderTrack} />
        </>
    );
};

export default OrderPage;
