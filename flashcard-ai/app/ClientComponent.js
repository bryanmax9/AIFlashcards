"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import getStripe from "@/utils/get-stripe";
import LoadingScreen from "./loading/LoadingScreen";
import styles from "./home.module.css";

export default function ClientComponent() {
  const [loading, setLoading] = useState(false);
  const { isSignedIn } = useUser();
  const router = useRouter();

  const handleSubmit = async (planType) => {
    setLoading(true);

    const checkoutSession = await fetch("/api/checkout_session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ planType }),
    });

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
      setLoading(false);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });
    if (error) {
      console.warn("Error redirecting to Stripe:", error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  const handleGetStartedClick = () => {
    setLoading(true); // Show loading screen before redirecting
    if (isSignedIn) {
      router.push("/generate");
    } else {
      router.push("/sign-in");
    }
  };

  const handleLoginClick = () => {
    setLoading(true); // Show loading screen before redirecting
    router.push("/sign-in");
  };

  const handleSignUpClick = () => {
    setLoading(true); // Show loading screen before redirecting
    router.push("/sign-up");
  };

  const handleCheckFlashcardsClick = () => {
    setLoading(true); // Show loading screen before redirecting
    if (isSignedIn) {
      router.push("/flashcards");
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <Container maxWidth="100vw" className={styles.container}>
      <video className={styles.videoBackground} autoPlay muted loop>
        <source src="/purpleBG.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={styles.overlay}></div>
      {loading && <LoadingScreen />}
      <AppBar position="static" className={styles.appBar}>
        <Toolbar className={styles.toolbar}>
          <Typography variant="h6" className={styles.title}>
            Vimo AI
          </Typography>

          <SignedOut>
            <Button className={styles.loginButton} onClick={handleLoginClick}>
              Login
            </Button>
            <Button className={styles.signupButton} onClick={handleSignUpClick}>
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box className={styles.boxCentered}>
        <Typography variant="h2" className={styles.welcomeTitle} gutterBottom>
          Welcome to Vimo: Your AI Flashcard Companion
        </Typography>
        <Typography variant="h5" className={styles.subtitle} gutterBottom>
          Engage with Vimo, and he’ll craft tailored flashcards to help you
          conquer those challenging classes with *those* professors. 👀
        </Typography>
        <Button
          variant="contained"
          color="primary"
          className={styles.pricingButton}
          onClick={handleGetStartedClick}
        >
          Get Started
        </Button>
      </Box>
      <Box className={styles.featuresBox}>
        <Typography variant="h4" className={styles.featuresTitle} gutterBottom>
          Features
        </Typography>
        <Grid container className={styles.featureGrid} spacing={4}>
          <Grid item xs={12} md={4} className={styles.featureItem}>
            <Typography
              variant="h6"
              className={styles.featureItemTitle}
              gutterBottom
            >
              Easy Text Input
            </Typography>
            <Typography className={styles.featureDescription}>
              Simply input your text and let our Software do the rest. Creating
              Flashcards has never been easier.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} className={styles.featureItem}>
            <Typography
              variant="h6"
              className={styles.featureItemTitle}
              gutterBottom
            >
              Smart Flashcards
            </Typography>
            <Typography className={styles.featureDescription}>
              AI-generated flashcards tailored to your needs, making learning
              efficient and effective.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} className={styles.featureItem}>
            <Typography
              variant="h6"
              className={styles.featureItemTitle}
              gutterBottom
            >
              Accessible anywhere
            </Typography>
            <Typography className={styles.featureDescription}>
              Access your flashcards on any device, at any time, and never miss
              a study session.
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box className={styles.savedFlashcardsSection}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} className={styles.gifContainer}>
            <img
              src="/flashcards.gif"
              alt="Saved Flashcards GIF"
              className={styles.savedFlashcardsGif}
            />
          </Grid>
          <Grid item xs={12} md={6} className={styles.savedFlashcardsText}>
            <Typography variant="h4" gutterBottom>
              Check Your Saved Flashcards
            </Typography>
            <Typography variant="h6">
              Easily access and review your saved flashcards anytime. Organize,
              study, and succeed with your personalized flashcard collections.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              className={styles.savedFlashcardsButton}
              onClick={handleCheckFlashcardsClick}
            >
              Go to My Flashcards
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box className={styles.footer}>
        <Typography variant="body1" className={styles.footerText}>
          &copy; 2024 Vimo AI. All rights reserved.
        </Typography>
      </Box>
    </Container>
  );
}
