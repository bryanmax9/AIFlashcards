import { SignIn } from "@clerk/nextjs";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
import styles from "./home.module.css";

export default function SimplePage() {
  return (
    <Container maxWidth="100vw" className={styles.container}>
      {/* Background Video */}
      <video className={styles.videoBackground} autoPlay muted loop>
        <source src="/purpleBG.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={styles.overlay}></div>
      <AppBar position="static" className={styles.appBar}>
        <Toolbar className={styles.toolbar}>
          <Typography variant="h6" className={styles.title}>
            Vimo AI - AI Flashcard Companion
          </Typography>
          <Button color="inherit">
            <Link href="/sign-up" passHref className={styles.homeButton}>
              Sign Up
            </Link>
          </Button>
          <Button color="inherit">
            <Link href="/" passHref className={styles.homeButton}>
              Home
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
      <Box className={styles.signInBox}>
        <Typography variant="h4" className={styles.signInTitle}>
          Sign In
        </Typography>
        <SignIn />
      </Box>
    </Container>
  );
}
