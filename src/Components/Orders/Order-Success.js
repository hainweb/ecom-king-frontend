import React, { useEffect } from 'react';
// Correct import of confetti
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';

const OrderConfirmation = () => {

  useEffect(() => {
    // Function to create dots animation
    function createDots() {
      const container = document.querySelector('.icon-container');
      for (let i = 0; i < 20; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        container.appendChild(dot);
        animateDot(dot);
      }
    }

    // Function to animate individual dots
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

    // Start and stop confetti animation
    const startConfetti = () => {
      setTimeout(() => {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }, 100);
    };

    const stopConfetti = () => {
      setTimeout(() => {
        confetti.reset(); // This will clear the confetti
      }, 5000);
    };

    startConfetti();
    stopConfetti();
    
  }, []);

  return (
    <div className="main-main con">
      <div className="card">
        <div className="icon-container">
          <div className="circle">
            <span className="checkmark">✓</span>
          </div>
        </div>
        <h2>Thank you for ordering!</h2>
        <p>Thank you for choosing Our Services. We appreciate your business and look forward to serving you again!</p>
        <div className="buttons">
         <Link to={'/orders'}>
            <button className="view-order">VIEW ORDER</button>
          </Link>
         <Link to={'/'}>
            <button className="continue-shopping">CONTINUE SHOPPING</button>
         </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
