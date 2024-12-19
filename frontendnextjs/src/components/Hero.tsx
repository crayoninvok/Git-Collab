'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

interface HeroProps {
  title: string;
  highlightedText: string;
  searchPlaceholder: string;
  videoId?: string; 
}

export default function Hero({
  title,
  highlightedText,
  searchPlaceholder,
  videoId = 'Fpn1imb9qZg' 
}: HeroProps) {
  const [isHovered, setIsHovered] = useState(false);
  const images = ['/hero/cass.jpg', '/hero/ed sheeran.png', '/hero/westlife.png'];

  return (
    <section 
      className="relative h-screen"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Auto-playing Swiper */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
          <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{
            crossFade: true
          }}
          loop={true} 
          speed={3500} 
          slidesPerView={1}
          autoplay={{
            delay: 0, 
            disableOnInteraction: false, 
            pauseOnMouseEnter: false, 
          }}
          allowTouchMove={false} 
          watchSlidesProgress={true}
          className="h-full w-full"
        >

          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div 
                className="h-full w-full bg-cover bg-center bg-no-repeat transition-all duration-1500"
                style={{
                  backgroundImage: `url('${image}')`,
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="relative w-full h-full">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              pointerEvents: isHovered ? 'auto' : 'none'
            }}
          />
          <div className="absolute inset-0 bg-black/30 pointer-events-none transition-opacity duration-500" />
        </div>
      </div>


      <div className={`relative z-10 h-full flex items-center justify-center transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
            {title}
            <span className="text-orange-500"> {highlightedText}</span>
          </h1>
        </div>
      </div>
    </section>
  );
}