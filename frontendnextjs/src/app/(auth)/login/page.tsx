"use client";

import Link from "next/link";
import React, { useState } from "react";

export default function LoginStart() {
  const [hoveredPanel, setHoveredPanel] = useState<string | null>(null);

  // Vdio langsun di cloud
  const leftVideoUrl =
    "https://res.cloudinary.com/dpuqloe2r/video/upload/v1733646900/left_qcwzko.mp4";
  const rightVideoUrl =
    "https://res.cloudinary.com/dpuqloe2r/video/upload/v1733646900/right_frb36p.mp4";

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <div
        className="flex-1 flex items-center justify-center relative group"
        onMouseEnter={() => setHoveredPanel("left")}
        onMouseLeave={() => setHoveredPanel(null)}
      >
        <video
          autoPlay
          muted
          loop
          className={`absolute w-full h-full object-cover transition-all duration-500 ${
            hoveredPanel === "right" ? "blur-md scale-110" : ""
          }`}
        >
          <source src={leftVideoUrl} type="video/mp4" />
        </video>

        <div
          className={`absolute inset-0 bg-black transition-opacity duration-500 ${
            hoveredPanel === "right" ? "opacity-25" : "opacity-50"
          }`}
        ></div>

        <div className="panel-content relative flex flex-col items-center justify-center text-center space-y-4 p-6 md:p-0">
          <h1 className="panel-heading text-3xl md:text-4xl font-bold text-white">
            Buy <span className="text-orange-500">Ticket</span>
          </h1>
          <p className="panel-text text-white text-sm md:text-base">
            Discover and secure your spot at the premier design events of the
            year.
          </p>
          <Link href="/login/loginuser" passHref>
            <button className="panel-button bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-md transition-all duration-300">
              Login as Customer
            </button>
          </Link>
        </div>
      </div>

      <div
        className="flex-1 flex items-center justify-center relative group"
        onMouseEnter={() => setHoveredPanel("right")}
        onMouseLeave={() => setHoveredPanel(null)}
      >
        <video
          autoPlay
          muted
          loop
          className={`absolute w-full h-full object-cover transition-all duration-500 ${
            hoveredPanel === "left" ? "blur-md scale-130" : ""
          }`}
        >
          <source src={rightVideoUrl} type="video/mp4" />
        </video>

        <div
          className={`absolute inset-0 bg-black transition-opacity duration-500 ${
            hoveredPanel === "left" ? "opacity-25" : "opacity-50"
          }`}
        ></div>

        <div className="panel-content relative flex flex-col items-center justify-center text-center space-y-4 p-6 md:p-0">
          <h1 className="panel-heading text-3xl md:text-4xl font-bold text-white">
            Create an <span className="text-orange-500">Event</span>
          </h1>
          <p className="panel-text text-white text-sm md:text-base">
            Empower your vision with our event management tool to create an
            Event
          </p>
          <Link href="/login/loginpromotor" passHref>
            <button className="panel-button bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-md transition-all duration-300">
              Login as Event Promotor
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
