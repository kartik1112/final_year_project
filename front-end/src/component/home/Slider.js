import React, { useState, useEffect } from 'react';
import { Carousel, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Slider.css';

const Slider = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const slides = [
    {
      image: "/images/image1.png",
      title: "Capture Your Perfect Moments",
      subtitle: "Share memories with friends and family using AI face recognition",
      cta: "Get Started"
    },
    {
      image: "/images/wedding.jpg",
      title: "Perfect for Weddings",
      subtitle: "Let guests find their photos instantly with facial recognition",
      cta: "Learn How"
    },
    {
      image: "/images/wedding2.jpg",
      title: "Everyone Gets Their Photos",
      subtitle: "No more searching through hundreds of pictures",
      cta: "Create Event"
    },
    {
      image: "/images/wedding4.jpg",
      title: "Seamless Photo Sharing",
      subtitle: "Smart, secure, and simple to use",
      cta: "Try It Free"
    }
  ];

  const handleSlideChange = (current) => {
    setActiveSlide(current);
  };

  return (
    <div className="hero-slider-container">
      <Carousel 
        autoplay 
        effect="fade"
        beforeChange={handleSlideChange}
        className="hero-slider"
        dots={{ className: 'custom-dots' }}
      >
        {slides.map((slide, index) => (
          <div key={index}>
            <div className="slide-content">
              <div className="slide-overlay"></div>
              <img 
                src={slide.image} 
                alt={`Slide ${index + 1}`} 
                className="slide-image" 
              />
              <div className={`slide-text ${activeSlide === index ? 'active' : ''}`}>
                <h1 className="slide-title">{slide.title}</h1>
                <p className="slide-subtitle">{slide.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <div className="mouse">
          <div className="wheel"></div>
        </div>
        <div className="scroll-text">Scroll down</div>
      </div>

      {/* Feature highlights */}
      <div className="feature-highlights">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="feature-item">
                <div className="feature-icon">🔍</div>
                <h3>Face Recognition</h3>
                <p>Automatically find photos you appear in</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <h3>Private & Secure</h3>
                <p>Your photos are safe and private</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-item">
                <div className="feature-icon">💫</div>
                <h3>Easy Sharing</h3>
                <p>Share with friends via custom links</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;