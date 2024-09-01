import { Box, CircularProgress, Typography } from "@mui/material";
import { Color } from "three";

export default function LoadingScreen() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        zIndex: 9999,
        color: "white",
      }}
    >
      <Box textAlign="center">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Box>
    </Box>
  );
}
