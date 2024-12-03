"use client";
import { useState, useEffect } from "react";

interface HeroProps {
  targetDate: string; // Prop for target date
}

export default function Hero({ targetDate }: HeroProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft("Event Started");
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section
      className="relative bg-center bg-transparent flex flex-col justify-center items-center text-white h-[47vh] p-10"
      style={{ backgroundImage: "url('/path-to-background.jpg')" }}
    >
      <div className="text-center">
        <p className="uppercase text-sm tracking-wide mb-4">
          A Festival Experience by{" "}
          <span className="text-yellow-500">ISMAYA Live</span>
        </p>
        <img
          src="/DWP.png"
          alt="DWP Logo"
          className="mx-auto w-full md:w-[40rem] lg:w-[40rem]"
        />
        <p className="text-lg md:text-2xl mt-4">13 • 14 • 15 DEC 2024</p>
        <p className="text-sm md:text-lg mt-1">
          JIEXPO KEMAYORAN • JAKARTA, INDONESIA
        </p>
        {/* Countdown Timer Display */}
        <div className="text-md font-semibold mb-3">{timeLeft}</div>
        <div className="flex justify-center space-x-4 mt-6">
          <button className="px-8 py-3 border-2 border-pink-500 text-white font-semibold rounded-xl hover:bg-orange-500 hover:text-black transition-all">
            BUY TICKETS
          </button>
          <button className="px-8 py-3 border-2 border-pink-500 text-white font-semibold rounded-xl hover:bg-orange-500 hover:text-black transition-all">
            FAQ
          </button>
        </div>
      </div>
    </section>
  );
}
