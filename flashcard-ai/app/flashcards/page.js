"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import Link from "next/link";
import styles from "./home.module.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import LoadingScreen from "../loading/LoadingScreen";

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;

      const docRef = doc(collection(db, "users"), user.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        setFlashcards(collections);
      } else {
        await setDoc(docRef, { flashcards: [] });
      }
    }

    getFlashcards();
  }, [user]);

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  const handleCardClick = (id) => {
    setLoading(true); // Set loading to true when a card is clicked
    router.push(`/flashcard?id=${id}`);
  };

  const handleHomeClick = () => {
    setLoading(true); // Set loading to true when the Home button is clicked
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <video className={styles.videoBackground} autoPlay muted loop>
        <source src="/purpleBG.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={styles.overlay}></div>
      {loading && <LoadingScreen />}{" "}
      {/* Show the loading screen if loading is true */}
      <div className={styles.header}>
        <div className={styles.homeButton} onClick={handleHomeClick}>
          <img src="/icons/home.svg" alt="Home" />
          Home
        </div>
        <Typography variant="h4" className={styles.title}>
          Flashcards
        </Typography>
      </div>
      <div className={styles.content}>
        <div className={styles.flashcardsContainer}>
          <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} key={index}>
                <Card className={styles.flashcard}>
                  <CardActionArea
                    onClick={() => {
                      handleCardClick(flashcard.name);
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" className={styles.flashcardText}>
                        {flashcard.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
        <div className={styles.modelContainer}>
          <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Model />
            <OrbitControls />
          </Canvas>
        </div>
      </div>
    </div>
  );
}

function Model() {
  const gltf = useGLTF("/house1.gltf");
  return <primitive object={gltf.scene} scale={1} />;
}
