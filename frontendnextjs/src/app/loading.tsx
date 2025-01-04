"use client";


import React from "react";

const Loading: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="custom-loading-container flex flex-col">
      <div className="custom-loader">
        <div className="custom-loader-text space-x-2">TI<span className="text-orange-500">KO</span></div>
      </div>
      {message && (
        <h1 className="text-3xl font-bold text-white mt-4">{message}</h1>
      )}
    </div>
  );
};

export default Loading;
