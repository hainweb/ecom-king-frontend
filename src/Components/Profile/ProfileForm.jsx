import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../Urls/Urls";

const ProfileForm = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const [profileData, setProfileData] = useState({
        Name: user?.Name || "",
        LastName: user?.LastName || "",
        Gender: user?.Gender || "",
        Email: user?.Email || "",
        Mobile: user?.Mobile || "",
    });

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

    return (
        <>


<div class="grid grid-cols-2 gap-4 p-4 md:hidden">
 { /* Orders */}
  <div class="flex flex-col items-center justify-center p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">
    <svg class="w-6 h-6 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18M9 21V9m12 12V9m-9 12V9M9 3v18M3 3v18M9 3h6" />
    </svg>
    <p class="text-gray-700 dark:text-gray-300">Orders</p>
  </div>

 {/* <!-- Wishlist -->*/}
  <div class="flex flex-col items-center justify-center p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">
    <svg class="w-6 h-6 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-1.019 1.752-1.019 2.052 0l2.18 7.41H22a1 1 0 01.857 1.514l-5.482 8.472-2.181-7.411h-6.787l-2.18 7.411-5.482-8.472A1 1 0 012 10.337h7.789l2.181-7.41z" />
    </svg>
    <p class="text-gray-700 dark:text-gray-300">Wishlist</p>
  </div>

 {/* <!-- Coupons -->*/}
  <div class="flex flex-col items-center justify-center p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">
    <svg class="w-6 h-6 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-2.21 0-4-1.79-4-4h8c0 2.21-1.79 4-4 4zm0 8c2.21 0 4 1.79 4 4h-8c0-2.21 1.79-4 4-4zM2 12a10 10 0 1012-12A10 10 0 102 12z" />
    </svg>
    <p class="text-gray-700 dark:text-gray-300">Coupons</p>
  </div>

{ /* <!-- Help Center -->*/}
  <div class="flex flex-col items-center justify-center p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">
    <svg class="w-6 h-6 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-2.828-2.828a4 4 0 00-5.657 0L4.22 8.485A4 4 0 004.22 14.1l2.828 2.828a4 4 0 005.657 0l5.657-5.657a4 4 0 000-5.657z" />
    </svg>
    <p class="text-gray-700 dark:text-gray-300">Help Center</p>
  </div>
</div>

            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white mt-2 sm:mt-0 md:mt-0">Personal Information</h2>
            <form className="space-y-4">
                {/* Form fields */}
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

                {/* Gender */}
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

                {/* Email */}
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

                {/* Mobile */}
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

                {/* Action buttons */}
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
    );
};

export default ProfileForm;