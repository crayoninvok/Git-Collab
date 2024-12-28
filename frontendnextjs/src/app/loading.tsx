"use client";

import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <CircularProgress
        size={80} 
        thickness={4} 
        sx={{
          color: "#FFA500", 
        }}
      />
    </div>
  );
}
