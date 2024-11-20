import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const ProgressLoading = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
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

export default ProgressLoading;
