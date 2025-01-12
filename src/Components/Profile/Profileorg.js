import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { LogOut, MenuIcon, MoreVertical, X } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../Urls/Urls";

const ProfilePage = ({ user }) => {
    const location = useLocation();
    const [view, setView] = useState(location.state?.view || "profile");
    const [isEditing, setIsEditing] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [errors, setErrors] = useState({});
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false); // State for mobile nav

    // Profile Data State
    const [profileData, setProfileData] = useState({
        Name: user?.Name || "",
        LastName: user?.LastName || "",
        Gender: user?.Gender || "",
        Email: user?.Email || "",
        Mobile: user?.Mobile || "",
    });

    // Address Data State
    const emptyAddressData = {
        Name: user?.Name || "",
        Mobile: user?.Mobile || "",
        Address: "",
        Pincode: "",
        State: "",
        City: "",
        Type: "",
    };
    const [addressData, setAddressData] = useState(emptyAddressData);

    // Profile Handlers
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateProfileFields = () => {
        const newErrors = {};
        if (!profileData.Name) newErrors.Name = "First name is required.";
        if (!profileData.LastName) newErrors.LastName = "Last name is required.";
        if (!profileData.Gender) newErrors.Gender = "Gender is required.";
        if (!profileData.Email || !/^\S+@\S+\.\S+$/.test(profileData.Email)) {
            newErrors.Email = "Please enter a valid email address.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProfileSave = async () => {
        if (!validateProfileFields()) return;
        try {
            const response = await axios.post(
                `${BASE_URL}/edit-profile`,
                profileData,
                { withCredentials: true }
            );
            if (response.data.status) {
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again later.");
        }
    };

    // Address Handlers
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateAddressFields = () => {
        const newErrors = {};
        if (!addressData.Name) newErrors.Name = "Name is required.";
        if (!addressData.Mobile) newErrors.Mobile = "Mobile is required.";
        if (!addressData.Address) newErrors.Address = "Address is required.";
        if (!addressData.Pincode) newErrors.Pincode = "Pincode is required.";
        if (!addressData.State) newErrors.State = "State is required.";
        if (!addressData.City) newErrors.City = "City is required.";
        if (!addressData.Type) newErrors.Type = "Address type is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddAddress = async () => {
        if (!validateAddressFields()) return;
        try {
            const response = await axios.post(
                `${BASE_URL}/add-address`,
                addressData,
                { withCredentials: true }
            );
            if (response.data.status) {
                setAddresses(response.data.address);
                setAddressData(emptyAddressData);
                setView("manageAddress");
            }
        } catch (error) {
            console.error("Error adding address:", error);
            alert("Failed to add address. Please try again later.");
        }
    };

    const handleEditAddress = async () => {
        if (!validateAddressFields()) return;
        try {
            const response = await axios.post(
                `${BASE_URL}/edit-user-address`,
                { ...addressData, _id: editingAddressId },
                { withCredentials: true }
            );
            if (response.data.status) {
                setAddresses(response.data.updatedAddress);
                setEditingAddressId(null);
                setAddressData(emptyAddressData);
            }
        } catch (error) {
            console.error("Error updating address:", error);
            alert("Failed to update address. Please try again later.");
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            try {
                const response = await axios.post(
                    `${BASE_URL}/delete-address`,
                    { addressId },
                    { withCredentials: true }
                );
                if (response.data.status) {
                    setAddresses(response.data.Address);
                }
            } catch (error) {
                console.error("Error deleting address:", error);
                alert("Failed to delete address. Please try again later.");
            }
        }
    };

    const startEditingAddress = (address) => {
        setEditingAddressId(address._id);
        setAddressData({
            Name: address.Name,
            Mobile: address.Mobile,
            Address: address.Address,
            Pincode: address.Pincode,
            State: address.State,
            City: address.City,
            Type: address.Type,
        });
    };

    // Fetch Addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await axios.get(
                    `${BASE_URL}/get-address`,
                    { withCredentials: true }
                );
                if (response.data.status) {
                    setAddresses(response.data.userAddress);
                }
            } catch (error) {
                console.error("Error fetching addresses:", error);
                alert("Failed to fetch addresses. Please try again later.");
            }
        };
        fetchAddresses();
    }, []);

    // Address Form Component
    const AddressForm = ({ onSubmit, submitButtonText }) => (
        <div className="mt-4 space-y-4">
            <div className="w-full">
                <input
                    type="text"
                    name="Name"
                    value={addressData.Name || ""}
                    onChange={handleAddressChange}
                    placeholder="Name"
                    className={`border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.Name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        }`}
                />
                {errors.Name && <p className="text-red-500 text-xs">{errors.Name}</p>}
            </div>

            <input
                type="text"
                name="Mobile"
                value={addressData.Mobile || ""}
                onChange={handleAddressChange}
                placeholder="Mobile"
                className={`border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.Mobile ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
            />
            {errors.Mobile && <p className="text-red-500 text-xs">{errors.Mobile}</p>}

            <textarea
                name="Address"
                value={addressData.Address || ""}
                onChange={handleAddressChange}
                placeholder="Enter your address"
                className={`border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.Address ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                rows={3}
            />
            {errors.Address && <p className="text-red-500 text-xs">{errors.Address}</p>}

            <input
                type="text"
                name="Pincode"
                value={addressData.Pincode || ""}
                onChange={handleAddressChange}
                placeholder="Pincode"
                className={`border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.Pincode ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
            />
            {errors.Pincode && <p className="text-red-500 text-xs">{errors.Pincode}</p>}

            <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    State
                </label>
                <select
                    name="State"
                    value={addressData.State || ""}
                    onChange={handleAddressChange}
                    className={`border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.State ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        }`}
                >
                    <option value="">Select State</option>
                    <option value="kerala">Kerala</option>
                    <option value="tamilnadu">Tamil Nadu</option>
                </select>
                {errors.State && <p className="text-red-500 text-xs">{errors.State}</p>}
            </div>

            <input
                type="text"
                name="City"
                value={addressData.City || ""}
                onChange={handleAddressChange}
                placeholder="City"
                className={`border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.City ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
            />
            {errors.City && <p className="text-red-500 text-xs">{errors.City}</p>}

            <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Type
                </label>
                <select
                    name="Type"
                    value={addressData.Type || ""}
                    onChange={handleAddressChange}
                    className={`border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.Type ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        }`}
                >
                    <option value="">Select Type</option>
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                </select>
                {errors.Type && <p className="text-red-500 text-xs">{errors.Type}</p>}
            </div>

            <div className="flex justify-end mt-4 space-x-2">
                <button
                    type="button"
                    onClick={onSubmit}
                    className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-600 dark:hover:bg-green-700"
                >
                    {submitButtonText}
                </button>
                {editingAddressId && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditingAddressId(null);
                            setAddressData(emptyAddressData);
                        }}
                        className="bg-gray-500 dark:bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-600 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center">
            <div className="w-full bg-blue-600 dark:bg-blue-800 text-white py-4 text-center text-lg font-semibold">
                Hello, {profileData.Name || "User  "}!
            </div>

            <div className="w-full max-w-5xl bg-white dark:bg-gray-800 shadow-md mt-8 p-6 rounded-md">
                <div className="flex">
                    {/* Mobile Toggle Button */}


                    {isMobileNavOpen ? (
                        <button
                            className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg"
                            onClick={() => setIsMobileNavOpen(false)}
                        >
                            <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        </button>
                    ) : (
                        <button
                            className="md:hidden p-2 text-gray-700 dark:text-gray-300 z-50"
                            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                        >
                            <MenuIcon className="w-6 h-6" />
                        </button>
                    )}

                    {/* Sidebar */}
                    <div className={`${isMobileNavOpen ? "fixed inset-0 z-50 bg-white dark:bg-gray-800 w-64" : "hidden"
                        } md:block md:w-1/4 md:relative border-r border-gray-300 dark:border-gray-700 pr-4`}>
                        <ul className="space-y-4 text-gray-700 dark:text-gray-300">
                            <li className="font-bold hover:text-blue-600 dark:hover:text-blue-400" onClick={() => setIsMobileNavOpen(false)}>MY ORDERS</li>
                            <li className="font-bold hover:text-blue-600 dark:hover:text-blue-400" onClick={() => setIsMobileNavOpen(false)}>ACCOUNT SETTINGS</li>
                            <ul className="pl-4 space-y-2 text-sm">
                                <li
                                    className={`cursor-pointer ${view === "profile" ? "text-blue-600 dark:text-blue-400 font-semibold" : "hover:text-blue-600 dark:hover:text-blue-400"}`}
                                    onClick={() => {
                                        setView("profile");
                                        setIsMobileNavOpen(false);
                                    }}
                                >
                                    Profile Information
                                </li>
                                <li
                                    className={`cursor-pointer ${view === "manageAddress" ? "text-blue-600 dark:text-blue-400 font-semibold" : "hover:text-blue-600 dark:hover:text-blue-400"}`}
                                    onClick={() => {
                                        setView("manageAddress");
                                        setIsMobileNavOpen(false);
                                    }}
                                >
                                    Manage Addresses
                                </li>
                                <li className="hover:text-blue-600 dark:hover:text-blue-400" onClick={() => setIsMobileNavOpen(false)}>Password & Security</li>
                            </ul>
                            <li className="font-bold hover:text-blue-600 dark:hover:text-blue-400" onClick={() => setIsMobileNavOpen(false)}>PAYMENTS</li>
                            <ul className="pl-4 space-y-2 text-sm">
                                <li className="hover:text-blue-600 dark:hover:text-blue-400" onClick={() => setIsMobileNavOpen(false)}>Gift Cards</li>
                                <li className="hover:text-blue-600 dark:hover:text-blue-400" onClick={() => setIsMobileNavOpen(false)}>Saved UPI</li>
                                <li className="hover:text-blue-600 dark:hover:text-blue-400" onClick={() => setIsMobileNavOpen(false)}>Saved Cards</li>
                            </ul>
                            <li className="font-bold flex items-center text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500">
                                <Link to="/logout" className="flex items-center" onClick={() => setIsMobileNavOpen(false)}>
                                    <LogOut className="w-5 mr-2" />
                                    Sign Out
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Main Content */}
                    <div className="w-3/4 pl-4">
                        {view === "profile" && (
                            <>
                                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Personal Information</h2>
                                <form className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-1/2">
                                            <input
                                                type="text"
                                                name="Name"
                                                value={profileData.Name}
                                                onChange={handleProfileChange}
                                                placeholder="First Name"
                                                className={`border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.Name ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
                                                readOnly={!isEditing}
                                            />
                                            {errors.Name && <p className="text-red-500 text-xs">{errors.Name}</p>}
                                        </div>
                                        <div className="w-1/2">
                                            <input
                                                type="text"
                                                name="LastName"
                                                value={profileData.LastName}
                                                onChange={handleProfileChange}
                                                placeholder="Last Name"
                                                className={`border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.LastName ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
                                                readOnly={!isEditing}
                                            />
                                            {errors.LastName && <p className="text-red-500 text-xs">{errors.LastName}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Your Gender</label>
                                        <div className="flex gap-6">
                                            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                <input
                                                    type="radio"
                                                    name="Gender"
                                                    value="Male"
                                                    checked={profileData.Gender === "Male"}
                                                    onChange={handleProfileChange}
                                                    disabled={!isEditing}
                                                />
                                                Male
                                            </label>
                                            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                <input
                                                    type="radio"
                                                    name="Gender"
                                                    value="Female"
                                                    checked={profileData.Gender === "Female"}
                                                    onChange={handleProfileChange}
                                                    disabled={!isEditing}
                                                />
                                                Female
                                            </label>
                                        </div>
                                        {errors.Gender && <p className="text-red-500 text-xs">{errors.Gender}</p>}
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
                                        <input
                                            type="email"
                                            name="Email"
                                            value={profileData.Email}
                                            onChange={handleProfileChange}
                                            className={`border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.Email ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
                                            readOnly={!isEditing}
                                        />
                                        {errors.Email && <p className="text-red-500 text-xs">{errors.Email}</p>}
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Mobile</label>
                                        <input
                                            type="text"
                                            name="Mobile"
                                            value={profileData.Mobile}
                                            className="border p-2 rounded w-full bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
                                            readOnly
                                        />
                                    </div>

                                    <div className="flex justify-end mt-4 space-x-2">
                                        {isEditing ? (
                                            <button
                                                type="button"
                                                onClick={handleProfileSave}
                                                className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-600 dark:hover:bg-green-700"
                                            >
                                                Save
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(true)}
                                                className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-600 dark:hover:bg-blue-700"
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </>
                        )}

                        {view === "manageAddress" && (
                            <>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Manage Addresses</h2>
                                <ul className="mt-4 space-y-4">
                                    {Array.isArray(addresses) && addresses.length === 0 ? (
                                        <p className="text-center text-gray-500 dark:text-gray-400">No addresses available.</p>
                                    ) : (
                                        Array.isArray(addresses) &&
                                        addresses.map((addr) => (
                                            <div
                                                key={addr._id}
                                                className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                            >
                                                {editingAddressId === addr._id ? (
                                                    <AddressForm
                                                        onSubmit={handleEditAddress}
                                                        submitButtonText="Update Address"
                                                    />
                                                ) : (
                                                    <li className="border-b last:border-b-0 pb-4 border-gray-200 dark:border-gray-600">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex flex-col space-y-2">
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">Type: {addr.Type}</p>
                                                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                                                                    {addr.Name}
                                                                </h3>
                                                                <p className="text-sm text-gray-600 dark:text-gray-300">{addr.Mobile}</p>
                                                            </div>
                                                            <Menu as="div" className="relative">
                                                                <Menu.Button className="inline-flex justify-center items-center p-2 rounded-full bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Menu.Button>
                                                                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                                    <Menu.Item>
                                                                        {({ active }) => (
                                                                            <button
                                                                                className={`${active ? "bg-gray-100 dark:bg-gray-600" : ""
                                                                                    } group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                                                                                onClick={() => startEditingAddress(addr)}
                                                                            >
                                                                                Edit
                                                                            </button>
                                                                        )}
                                                                    </Menu.Item>
                                                                    <Menu.Item>
                                                                        {({ active }) => (
                                                                            <button
                                                                                className={`${active ? "bg-gray-100 dark:bg-gray-600" : ""
                                                                                    } group flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400`}
                                                                                onClick={() => handleDeleteAddress(addr._id)}
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        )}
                                                                    </Menu.Item>
                                                                </Menu.Items>
                                                            </Menu>
                                                        </div>
                                                        <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                                                            <p>
                                                                {addr.Pincode} | {addr.City}, {addr.State}
                                                            </p>
                                                            <p>{addr.Address}</p>
                                                        </div>
                                                    </li>
                                                )}

                                            </div>
                                        ))
                                    )}
                                </ul>

                                <button
                                    className="mt-4 bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-600 dark:hover:bg-blue-700"
                                    onClick={() => setView("addAddress")}
                                >
                                    Add Address
                                </button>
                            </>
                        )}

                        {view === "addAddress" && (
                            <>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add Address</h2>
                                <AddressForm
                                    onSubmit={handleAddAddress}
                                    submitButtonText="Save Address"
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;