import React from "react";
import { Typography, Container } from "@mui/material";

export default function Home() {
  return (
    <Container maxWidth="sm" style={{ marginTop: 20 }}>
      <Typography variant="h2" align="center" gutterBottom>
        Home
      </Typography>
      <Typography variant="body1" align="center">
        Log in to track your expenses
      </Typography>
    </Container>
  );
}
