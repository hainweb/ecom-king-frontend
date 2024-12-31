import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: About Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm">
              We are an e-commerce platform that provides a wide range of products at great prices.
            </p>
          </div>

          {/* Column 2: Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="text-sm">
              <li><Link to="/help-center" className="hover:text-indigo-400">Help Center</Link></li>
              <li><Link to="/orders" className="hover:text-indigo-400">Track Order</Link></li>
              <li><Link to="/orders" className="hover:text-indigo-400">Return & Exchange</Link></li>
              <li><Link to="/orders" className="hover:text-indigo-400">Shipping Info</Link></li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="text-sm">
              <li><a href="#" className="hover:text-indigo-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-400">FAQs</a></li>
              <li><Link to="/help-center" className="hover:text-indigo-400">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-xl hover:text-indigo-400">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-xl hover:text-indigo-400">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-xl hover:text-indigo-400">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-xl hover:text-indigo-400">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p className="text-sm">&copy; 2025 Your Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
