"use client";
import { selectIsLoading } from "@/redux/features/LoadingSlice";
import { useAppSelector } from "@/redux/hooks";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import React from "react";

const Loading = () => {
  const isLoading = useAppSelector(selectIsLoading);

  // check if it isn't loading just return nothing
  if (!isLoading) return;
  return (
    <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center bg-black bg-opacity-50 z-50 text-red-700">
      {/* <h1 className="text-white text-center">Loading...</h1> */}
      <Box
        sx={{
          display: "flex",
        }}
      >
        <CircularProgress
          sx={{ color: "rgb(185 28 28 / var(--tw-text-opacity))" }}
        />
      </Box>
    </div>
  );
};

export default Loading;
