"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  Grid,
  Typography,
  CardActionArea,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
import styles from "./home.module.css";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) {
        console.log("No search parameter or user is not available.");
        return;
      }

      try {
        const colRef = collection(
          doc(collection(db, "users"), user.id),
          search
        );
        const docs = await getDocs(colRef);
        const flashcards = [];

        docs.forEach((doc) => {
          flashcards.push({ id: doc.id, ...doc.data() });
        });

        console.log("Fetched flashcards:", flashcards);
        setFlashcards(flashcards);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    }

    getFlashcard();
  }, [user, search]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  if (flashcards.length === 0) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No flashcards found. Please check if the correct ID is provided in the
          URL.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="100vw" className={styles.container}>
      <video className={styles.videoBackground} autoPlay muted loop>
        <source src="/purpleBG.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={styles.overlay}></div>
      <AppBar position="static" className={styles.appBar}>
        <Toolbar>
          <Link href="/" passHref>
            <IconButton edge="start" color="inherit" aria-label="home">
              <HomeIcon />
            </IconButton>
          </Link>
          <Typography variant="h6" className={styles.title}>
            Flashcards
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid container spacing={3} className={styles.flashcardsGrid}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <CardActionArea
              onClick={() => {
                handleCardClick(index);
              }}
              className={styles.cardActionArea}
            >
              <Box
                className={`${styles.flashcardBox} ${
                  flipped[index] ? styles.flipped : ""
                }`}
              >
                <div>
                  <div className={styles.flashcardFront}>
                    <Typography variant="h6" component="div" align="center">
                      {flashcard.front}
                    </Typography>
                  </div>
                  <div className={styles.flashcardBack}>
                    <Typography variant="h6" component="div" align="center">
                      {flashcard.back}
                    </Typography>
                  </div>
                </div>
              </Box>
            </CardActionArea>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
