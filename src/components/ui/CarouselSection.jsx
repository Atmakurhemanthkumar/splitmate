import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './CarouselSection.css'; // Import the required CSS file

// REDUCED MOCK DATA TO 3 ITEMS TO SYNCHRONIZE WITH THE VISIBLE CARDS/INDICATORS
const DEFAULT_ITEMS = [
  { 
    id: 1, 
    title: 'Expense Tracking', 
    description: 'Effortlessly log and categorize your spending with friends.', 
    additionalContent: 'View detailed reports and insights.' 
  },
  { 
    id: 2, 
    title: 'Bill Splitting', 
    description: 'Divide shared bills and IOUs with customizable rules.', 
    additionalContent: 'Supports various currencies and groups.' 
  },
  { 
    id: 3, 
    title: 'Group Budgets', 
    description: 'Set and manage budgets for group trips and events.', 
    additionalContent: 'Stay on top of your collective spending.' 
  },
];

/**
 * A custom Carousel component with fixed horizontal layout and synchronized indicators.
 */
export const CarouselSection = ({
  items = DEFAULT_ITEMS,
  baseWidth = 450, // Assuming 900px is the desired width for one item (container max-width)
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = true,
  round = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false); 
  const carouselRef = useRef(null);
  
  const x = useMotionValue(0); 
  const smoothX = useSpring(x, { damping: 20, stiffness: 100, mass: 0.5 });

  const itemWidth = baseWidth; // One item takes up the full baseWidth
  const scrollOffset = -currentIndex * itemWidth;

  const handleMouseEnter = () => {
    if (autoplay && pauseOnHover) {
        setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (autoplay && pauseOnHover) {
        setIsHovering(false);
    }
  };

  useEffect(() => {
    x.set(scrollOffset);

    let interval;
    if (autoplay && !isHovering) { 
      interval = setInterval(() => {
        setCurrentIndex(prevIndex => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= items.length) {
            return loop ? 0 : prevIndex; 
          }
          return nextIndex;
        });
      }, autoplayDelay);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoplay, autoplayDelay, loop, items.length, currentIndex, scrollOffset, x, isHovering]);

  const navigate = (direction) => {
    setCurrentIndex(prevIndex => {
      if (direction === 'next') {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= items.length) {
          return loop ? 0 : prevIndex;
        }
        return nextIndex;
      } else if (direction === 'prev') {
        const nextIndex = prevIndex - 1;
        if (nextIndex < 0) {
          return loop ? items.length - 1 : prevIndex;
        }
        return nextIndex;
      }
      return prevIndex;
    });
  };

  const containerStyle = {
    width: `${baseWidth}px`,
  };

  return (
    <div
      ref={carouselRef}
      className={`carousel-container ${round ? 'round-variant' : ''}`}
      style={containerStyle}
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave} 
    >
      <motion.div 
        className="carousel-track"
        // CRITICAL: Ensure the total width is correct for smooth scrolling
        style={{ x: smoothX, width: items.length * itemWidth }}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            className="carousel-item"
            // CRITICAL: Force the individual card width
            style={{ minWidth: `${itemWidth}px`, maxWidth: `${itemWidth}px` }} 
          >
            {item.imageUrl ? (
              <div className="item-image">
                {/* Fallback image if URL fails */}
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/900x450/3b3b5c/fff?text=Image+Missing`; }}
                />
              </div>
            ) : (
              <div className="item-icon">{item.icon}</div>
            )}

            <div className="item-content">
                <h3 className="item-title">{item.title}</h3>
                <p className="item-description">{item.description}</p>
                {item.additionalContent && (
                    <p className="item-additional-content">{item.additionalContent}</p>
                )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <button
        className="nav-prev"
        onClick={() => navigate('prev')}
        disabled={!loop && currentIndex === 0}
      >
        &#9664;
      </button>
      <button
        className="nav-next"
        onClick={() => navigate('next')}
        disabled={!loop && currentIndex === items.length - 1}
      >
        &#9654;
      </button>

      <div className="carousel-indicators">
        {/* Indicators are generated based on the length of the new 3-item array */}
        {items.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};
export default CarouselSection;