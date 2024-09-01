"use client";
import { useUser } from "@clerk/nextjs";
import {
  Button,
  Box,
  Container,
  Typography,
  CircularProgress,
  Grid,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  doc,
  setDoc,
  collection,
  getDoc,
  writeBatch,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
import { db } from "@/firebase";
import styles from "./home.module.css";

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [eyesOpen, setEyesOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setEyesOpen((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (!data || !Array.isArray(data.flashcards)) {
        throw new Error("Received empty or invalid data");
      }

      setFlashcards(data.flashcards);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert(
        "An error occurred while generating flashcards. Please try again with a shorter input."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveFlashcards = async () => {
    if (!name) {
      alert("Please enter a name for your flashcards");
      return;
    }

    if (!isLoaded) {
      alert("User data is still loading. Please wait.");
      return;
    }

    if (!isSignedIn || !user) {
      alert("You must be signed in to save flashcards.");
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, "users"), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        alert("A flashcard collection with that name already exists");
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);

    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
    handleClose();
    router.push(`/flashcards`);
  };

  return (
    <Container maxWidth={false} className={styles.container}>
      {/* Background Video */}
      <video className={styles.videoBackground} autoPlay muted loop>
        <source src="/purpleBG.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={styles.overlay}></div>

      {/* Home Button */}
      <Link href="/" passHref>
        <Button className={styles.homeButton}>
          <HomeIcon fontSize="large" />
        </Button>
      </Link>

      <Box
        className={styles.robotFace}
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <div className={styles.robotFaceCircle}>
          <div className={styles.robotEyes}>
            <div className={styles.eye}></div>
            <div className={styles.eye}></div>
          </div>
        </div>
        <Typography variant="h4" className={styles.enterText}>
          Enter your text below to generate flashcards
        </Typography>
      </Box>

      <Box className={styles.inputBox}>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{
            mb: 2,
          }}
        />
        <Button
          variant="contained"
          className={styles.submitButton}
          onClick={handleSubmit}
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress size={40} />
        </Box>
      )}

      {!loading && flashcards && flashcards.length > 0 && (
        <Box sx={{ mt: 4 }} className={styles.flashcardsContainer}>
          <Typography variant="h5" gutterBottom>
            Flashcards Preview
          </Typography>
          <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <CardActionArea onClick={() => handleCardClick(index)}>
                  <Box
                    className={`${styles.flashcard} ${
                      flipped[index] ? styles.flashcardFlipped : ""
                    }`}
                  >
                    <div className={styles.flashcardFront}>
                      <Typography
                        variant="h6"
                        component="div"
                        className={styles.flashcardText}
                      >
                        {flashcard.front}
                      </Typography>
                    </div>
                    <div className={styles.flashcardBack}>
                      <Typography
                        variant="h6"
                        component="div"
                        className={styles.flashcardText}
                      >
                        {flashcard.back}
                      </Typography>
                    </div>
                  </Box>
                </CardActionArea>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="contained"
              className={styles.saveButton}
              onClick={handleOpen}
            >
              Save Flashcards
            </Button>
          </Box>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Flashcards</DialogTitle>
        <DialogContent className={styles.dialogContent}>
          <DialogContentText>
            Please enter a name for your flashcards collection.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Collection Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button className={styles.saveButton} onClick={saveFlashcards}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
