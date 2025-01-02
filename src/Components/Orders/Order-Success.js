import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';

const OrderConfirmation = () => {
  useEffect(() => {
    function createDots() {
      const container = document.querySelector('.icon-container');
      for (let i = 0; i < 20; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        container.appendChild(dot);
        animateDot(dot);
      }
    }

    function animateDot(dot) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 40 + Math.random() * 40;
      const startX = Math.cos(angle) * radius;
      const startY = Math.sin(angle) * radius;
      const endX = startX + (Math.random() - 0.5) * 20;
      const endY = startY + (Math.random() - 0.5) * 20;

      dot.style.left = `calc(50% + ${startX}px)`;
      dot.style.top = `calc(50% + ${startY}px)`;

      setTimeout(() => {
        dot.style.transition = 'all 2s ease-out';
        dot.style.left = `calc(50% + ${endX}px)`;
        dot.style.top = `calc(50% + ${endY}px)`;
        dot.style.opacity = '1';
      }, Math.random() * 1000);

      setTimeout(() => {
        dot.style.opacity = '0';
      }, 1500 + Math.random() * 500);

      setTimeout(() => animateDot(dot), 2000 + Math.random() * 1000);
    }

    createDots();

    const startConfetti = () => {
      setTimeout(() => {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }, 100);
    };

    const stopConfetti = () => {
      setTimeout(() => {
        confetti.reset();
      }, 5000);
    };

    startConfetti();
    stopConfetti();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:scale-105">
        <div className="relative h-32 mb-8" style={{ perspective: '1000px' }}>
          <div className="icon-container absolute inset-0 flex items-center justify-center">
            <div className="relative w-20 h-20">
              <div className="circle absolute inset-0 bg-green-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="checkmark text-3xl text-white transform scale-150">✓</span>
              </div>
            </div>
          </div>
          <style jsx>{`
            .dot {
              position: absolute;
              width: 4px;
              height: 4px;
              background: #22c55e;
              border-radius: 50%;
              opacity: 0;
            }
          `}</style>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">
          Thank you for ordering!
        </h2>
        
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Thank you for choosing Our Services. We appreciate your business and look forward to serving you again!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/orders" className="flex-1">
            <button className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg">
              VIEW ORDER
            </button>
          </Link>
          
          <Link to="/" className="flex-1">
            <button className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white font-semibold rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg">
              CONTINUE SHOPPING
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
