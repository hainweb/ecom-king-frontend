import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../Urls/Urls";
import { AlertCircle, Loader2 } from "lucide-react";

const PlaceOrderForm = ({ user, setSuccess, setCartCount }) => {
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [total, setTotal] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [product, setProduct] = useState(null)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [productLoading, setProductLoading] = useState(false)
  const location = useLocation();
  const { proId } = location.state || {}; // Destructure proId from state
  console.log('product id', proId);

  useEffect(() => {
    if (proId) {
      setProductLoading(true)
      axios.post(`${BASE_URL}/buy-product`, { proId }, { withCredentials: true }).then((response) => {
        console.log('res ', response);

        setTotal(response.data.total);
        setProduct(response.data.product)
        setProductLoading(false)
      });
    } else {
      axios.get(`${BASE_URL}/place-order`, { withCredentials: true }).then((response) => {
        setTotal(response.data.total);
      });
    }

    const fetchAddresses = async () => {
      try {

        const response = await axios.get(`${BASE_URL}/get-address`, { withCredentials: true });
        const addressList = response.data.userAddress || [];
        setAddresses(addressList);
        if (addressList.length > 0) {
          setSelectedAddress(addressList[0]._id);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, []);

  useEffect(() => {
    if (paymentMethod === "ONLINE") {
      setAvailabilityMessage("Not available online payment at this time");
    } else {
      setAvailabilityMessage("");
    }
  }, [paymentMethod]);

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAddress) {
      alert("Please select an address before placing the order.");
      return;
    }

    setSuccess(true);

    try {

      const requestData = {
        addressId: selectedAddress,
        paymentMethod,
        ...(proId && { proId, buyNow: true })  // Only include proId and buyNow if proId is present
      };
      setLoading(true)
      const response = await axios.post(
        `${BASE_URL}/place-order`,
        requestData,
        { withCredentials: true }
      );

      if (response.data.status) {

        if (!proId) {
          setCartCount(0)
        }
        alert("Ordered successfully");
        navigate("/order-success");

      } else {
        navigate("/cart", {
          state: { info: response.data.message, proId: response.data.product },
        });
        alert(response.data.message);
      }
      setLoading(false)
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order, please try again.");
    }
  };

  return (
    <section className="bg-gray-100 dark:bg-gray-800 min-h-screen py-8 mt-16">
      <div className="container mx-auto px-4">

        {productLoading ?
          (
            <div className="flex justify-center items-center">
            <Loader2 className="w-6 h-6 animate-spin text-black dark:text-white" />
          </div>
          )
          :

          product ? (
            <div className="bg-white dark:bg-gray-700 shadow-md rounded p-6 mb-6">
              <h4 className="text-center text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Product</h4>

              <div className="flex items-center space-x-4">
                <img
                  src={product.thumbnailImage}
                  alt={product.Name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                    {product.Name}
                  </h3>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ₹{product.Price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                      ₹{product.SellingPrice.toLocaleString()}
                    </span>
                  </div>
                  {product.Quantity < 1 ? (
                    <div className="mt-2 flex items-center text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">Out of Stock</span>
                    </div>
                  ) : product.Quantity < 5 ? (
                    <div className="mt-2 flex items-center text-yellow-600 dark:text-yellow-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">
                        Only {product.Quantity} left!
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            null
          )}

      



        <form id="checkform" onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-gray-700 shadow-md rounded p-6 mb-6">
            <h4 className="text-center text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Select Delivery Address</h4>
            {addresses.length > 0 ? (
              <div>
                {addresses.map((address) => (
                  <label
                    key={address._id}
                    className="block p-4 border rounded-lg mb-2 bg-gray-50 dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer">
                    <input
                      type="radio"
                      name="address"
                      value={address._id}
                      className="mr-2"
                      checked={selectedAddress === address._id}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                    />
                    <span className="text-gray-800 dark:text-gray-300">
                      {`${address.Name}, ${address.Address}, ${address.City}, ${address.State}, ${address.Pincode}`}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <button
                type="button"
                className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
                onClick={() => navigate("/profile", { state: { view: "manageAddress" } })}
              >
                Add Address
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-gray-700 shadow-md rounded p-6">
            <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Total Amount: ₹{total}</h5>
            <div className="mb-4">
              <p className="text-gray-800 dark:text-gray-300 mb-2">Payment Method</p>
              <label className="block mb-2">
                <input
                  type="radio"
                  name="payment-method"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={handlePaymentChange}
                  className="mr-2"
                />
                <span className="text-gray-800 dark:text-gray-300">Cash on Delivery (COD)</span>
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="payment-method"
                  value="ONLINE"
                  checked={paymentMethod === "ONLINE"}
                  onChange={handlePaymentChange}
                  className="mr-2"
                />
                <span className="text-gray-800 dark:text-gray-300">Online Payment</span>
              </label>
              {availabilityMessage && (
                <p className="text-red-500 text-sm mt-2">{availabilityMessage}</p>
              )}
            </div>

            <button
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
              type="submit"
              disabled={!selectedAddress || paymentMethod === "ONLINE"}
            >
              {loading ?
                 <div className="flex justify-center items-center">
                 <Loader2 className="w-4 h-4 animate-spin dark:text-white" />
               </div>
                :
                ' Complete Order'
              }
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default PlaceOrderForm;
