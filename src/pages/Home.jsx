import React from "react";
import { useNavigate } from "react-router-dom";
import StarBorderButton from "../components/ui/StarBorderButton";
import CarouselSection from "../components/ui/CarouselSection";
import Footer from "../components/layout/Footer";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero" id="home">
        <h1>Welcome to SplitMate</h1>
        <p>Track and split expenses easily with your friends.</p>
        <StarBorderButton onClick={handleGetStarted}>
          Get Started
        </StarBorderButton>
      </section>

      {/* About Section - Just wrap Carousel with ID */}
      <section id="about">
        <CarouselSection 
          baseWidth={900}
          autoplay={true}
          autoplayDelay={2000}
          pauseOnHover={true}
          loop={true}
          round={false}
        />
      </section>

      {/* Single Footer with ID - Both Services and Contact will scroll here */}
      <div id="services-contact">
        <Footer />
      </div>
    </>
  );
};

export default Home;