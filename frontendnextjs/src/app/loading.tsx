"use client";

import * as React from "react";
import { Stack } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Stack sx={{ width: "50%", color: "grey.500" }} spacing={2}>
        <LinearProgress color="secondary" />
        <LinearProgress color="success" />
        <LinearProgress color="inherit" />
      </Stack>
    </div>
  );
}
