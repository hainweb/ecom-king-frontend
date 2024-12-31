import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../Urls/Urls";
import { Link } from "react-router-dom";

export function Slider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slides, setSlides] = useState([]); // Initializing slides as an empty array

  const slideInterval = 3000; // Auto-play interval

  useEffect(() => {
    // Fetch existing slides
    const fetchSlides = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/get-sliders`, {
          withCredentials: true,
        });
        console.log("slider", response.data);
        setSlides(response.data || []); // Ensure it is always an array
      } catch (error) {
        console.error("Error fetching slides:", error);
      }
    };

    fetchSlides();

    // Optionally, you can set a timer to fetch slides periodically if necessary
    const intervalId = setInterval(fetchSlides, 60000); // Example: refetch slides every 1 minute

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []); // Empty dependency array so this effect only runs on mount

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, slideInterval);

      return () => clearInterval(interval); // Cleanup interval when slides change or component unmounts
    }
  }, [slides]); // This effect depends on slides, it will restart the interval if slides change

  // Effect to toggle dark mode class on body


  return (
    <div className="bg-gray-100 py-4 dark:bg-gray-800 ">


      {/* Slider Section */}

      <div className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-xl dark:bg-gray-800">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {Array.isArray(slides) &&
            slides.map((slide, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <Link to={`/category/${slide.linkTo}`}>
                  <img
                    src={slide.image}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                </Link>
              </div>
            ))}
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {Array.isArray(slides) &&
            slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-2 w-8 rounded-full transition-all ${activeIndex === i ? "bg-white" : "bg-white/50"
                  }`}
              ></button>
            ))}
        </div>

        <button
          onClick={() =>
            setActiveIndex((prevIndex) =>
              prevIndex === 0 ? slides.length - 1 : prevIndex - 1
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
          aria-label="Previous slide"
        >
          &#8592;
        </button>

        <button
          onClick={() =>
            setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length)
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
          aria-label="Next slide"
        >
          &#8594;
        </button>
      </div>



    </div>
  );
}

export default Slider;
