# Vimo AI Flashcard Generator - LinkWeb: https://ai-flashcards-eosin.vercel.app/

Welcome to the **Vimo AI Flashcard Generator**! This project uses AI to generate flashcards from user-provided text, helping users quickly grasp and retain key concepts.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Vimo AI is a flashcard generator powered by AI. Users can input text, and the AI generates concise and effective flashcards to aid learning. This project is built using Next.js, OpenAI, Firebase, and Material UI.

## Features

- **AI-Powered Flashcards:** Generate flashcards automatically based on user input.
- **Save Flashcards:** Save generated flashcards for later review.
- **Responsive Design:** Optimized for both desktop and mobile devices.
- **User Authentication:** Secure authentication using Clerk.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bryanmax9/AIFlashcards.git
   cd .\flashcard-ai\
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables: Create a .env.local file in the root directory with the following variables:**
   ```bash
   OPENROUTER_API_KEY=your-openrouter-api-key
   NEXT_PUBLIC_CLERK_FRONTEND_API=your-clerk-frontend-api
   FIREBASE_API_KEY=your-firebase-api-key
   FIREBASE_PROJECT_ID=your-firebase-project-id
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Build for production:**
   ```bash
   npm run build
   ```
6. **Start the production server:**
   ```bash
   npm start
   ```
## Technologies Used

    Next.js: React framework for building server-side rendered applications.
    OpenAI: Used for generating flashcards based on user input.
    Firebase: Used for storing user data and flashcards.
    Material UI: For designing the user interface.
    Clerk: For handling user authentication.

## Demo Video

Youtube Link: 

