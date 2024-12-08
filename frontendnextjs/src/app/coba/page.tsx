"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { Pagination, EffectCoverflow, Autoplay } from "swiper/modules";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link"; // Import Next.js Link component

export default function PromoterLogin() {
  const [formData, setFormData] = useState({
    promotorName: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });

  // Array of slide data
  const slides = [
    {
      src: "/entertaiment/ISMAYA.png",
      alt: "DWP Image",
      label: "Ismaya",
    },
    {
      src: "/entertaiment/PKENT.png",
      alt: "Concert Image",
      label: "PK ENTERTAIMENT",
    },
    {
      src: "/entertaiment/AKSELERASI.png",
      alt: "Concert Image",
      label: "AKSELERASI",
    },
    {
      src: "/entertaiment/IME.jpg",
      alt: "Concert Image",
      label: "IME KOREAN ENTERTAIMENT",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/concert1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-transparent shadow-xl rounded-lg flex w-full max-w-4xl overflow-hidden">
        {/* Left Section */}
        <div className="hidden md:flex flex-col w-1/2 bg-gradient-to-br from-orange-700 to-orange-400 items-center justify-center text-white p-10 relative">
          <Swiper
            modules={[Pagination, EffectCoverflow, Autoplay]}
            pagination={{ clickable: true }}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            className="w-full h-full"
          >
            {slides.map((slide, index) => (
              <SwiperSlide
                key={index}
                className="flex flex-col justify-center items-center"
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  width={400}
                  height={400}
                  className="rounded-lg"
                />
                <h2 className="absolute bottom-10 text-2xl font-bold text-white">
                  {slide.label}
                </h2>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Right Section */}
        <div className="flex flex-col justify-center w-full md:w-1/2 bg-gradient-to-r from-black/80 to-black/50 backdrop-blur-lg p-10">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Create a Promotor Account
            </h2>
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-orange-500 hover:underline">
                Log in
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="promotorname"
              placeholder="Promotor Name"
              value={formData.promotorName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:ring-purple-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:ring-purple-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:ring-purple-500"
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="form-checkbox h-5 w-5 text-purple-500"
              />
              <span className="text-gray-400">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-orange-500 hover:underline"
                >
                  Terms & Conditions
                </Link>
              </span>
            </div>
            <button
              type="submit"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded-md transition"
            >
              Create account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
