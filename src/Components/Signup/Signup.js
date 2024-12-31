import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../Urls/Urls';
import { User, Lock, Phone, ShoppingCart } from 'lucide-react';

const Signup = ({ setUser, setCartCount }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Name: '',
    Mobile: '',
    Password: '',
  });
  const [info, setInfo] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.Name.trim()) {
      setInfo('Name is required');
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.Mobile)) {
      setInfo('Mobile must be 10 digits');
      return false;
    }

    if (formData.Password.length < 4) {
      setInfo('Password must be at least 4 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    axios.post(`${BASE_URL}/signup`, formData, { withCredentials: true }).then((response) => {
      if (response.data.status) {
        setUser(response.data.user);
        setCartCount(0);
        navigate('/');
        setLoading(false);
      } else {
        setInfo('This number is already taken');
        setLoading(false);
        navigate('/signup');
      }
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white font-sans overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute w-96 h-96 bg-blue-300 opacity-10 blur-xl rounded-full"
          style={{ transform: `translate(${mousePosition.x / 10}px, ${mousePosition.y / 10}px)` }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-300 opacity-5 grid grid-cols-40">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-blue-200 opacity-10 blur-lg rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                animationDelay: `${Math.random() * -10}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg max-w-sm w-full p-6 z-10">
        <div className="text-center mb-6">
          <ShoppingCart className="w-12 h-12 text-blue-500 mx-auto animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
          <p className="text-sm text-gray-500">Create an account with us</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              placeholder="Full Name"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="number"
              name="Mobile"
              value={formData.Mobile}
              onChange={handleChange}
              placeholder="Mobile"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              placeholder="Password"
            />
          </div>

          {info && <p className="text-red-500 text-sm">{info}</p>}

          <Link to="/login" className="block text-center text-blue-500 text-sm underline">Already have an account?</Link>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition duration-200"
          >
            {loading ? <div className="loader" /> : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
