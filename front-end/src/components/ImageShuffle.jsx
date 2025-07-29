import React, { useEffect, useState } from 'react';
import '../styles/login-signup-creation.css';

const images = [
  '../../public/images/dating-page1.jpg',
  '../../public/images/dating-page (1).jpg',
  '../../public/images/dating-page (2).jpg',
  '../../public/images/dating-page (3).jpg',
  '../../public/images/dating-page (4).jpg',
];

const ImageShuffle = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="form-container-image">
      <img
        key={index}
        src={images[index]}
        alt="Background"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "38px",
          opacity: fade ? 1 : 0,
          transform: fade ? "translateX(0)" : "translateX(-40px)",
          transition: "opacity 0.5s ease-in-out, transform 0.5s cubic-bezier(0.4,0,0.2,1)"
        }}
      />
    </div>
  );
};

export default ImageShuffle;