import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = (count) => `
You are a flashcard creator. Generate ${count} concise flashcards with simple questions and one-word answers.

Each flashcard should be in this exact JSON format:
{
  "flashcards": [
    {
      "front": "question",
      "back": "answer"
    }
  ]
}

Ensure the JSON is properly formatted with no missing quotes, commas, or braces. The response should be short and complete.
`;

export async function POST(req) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const baseUrl = "https://openrouter.ai/api/v1";
  const data = await req.text();
  const flashcardsPerBatch = 2; // Number of flashcards generated per batch
  const totalFlashcards = 6; // Set this to 6 for generating exactly 6 flashcards
  let flashcards = [];
  let attempts = 0;
  const maxAttempts = 3;

  while (flashcards.length < totalFlashcards && attempts < maxAttempts) {
    try {
      const client = new OpenAI({
        baseURL: baseUrl,
        apiKey: apiKey,
      });

      const fetchOpenAI = client.chat.completions.create({
        model: "nousresearch/hermes-3-llama-3.1-405b",
        messages: [
          { role: "system", content: systemPrompt(flashcardsPerBatch) },
          { role: "user", content: data },
        ],
        response_format: "json",
        temperature: 0.1,
        max_tokens: 100, // Adjust to allow enough tokens for 6 flashcards
      });

      const completion = await fetchOpenAI;

      if (completion.choices?.[0]?.error) {
        console.error("API Error:", completion.choices[0].error);
        throw new Error("API returned an error");
      }

      let messageContent = completion.choices?.[0]?.message?.content;

      if (!messageContent) {
        console.error("Unexpected API response:", completion);
        throw new Error("Invalid response from OpenAI");
      }

      messageContent = sanitizeJsonString(messageContent);

      console.log("Sanitized JSON String:", messageContent);

      if (!isJsonComplete(messageContent)) {
        console.error("Incomplete JSON response detected:", messageContent);
        attempts++;
        continue; // Retry if the JSON is incomplete
      }

      let jsonString = extractJsonString(messageContent);

      try {
        console.log("Attempting to parse JSON:", jsonString);
        let batchFlashcards = JSON.parse(jsonString).flashcards;
        flashcards = flashcards.concat(batchFlashcards);

        if (flashcards.length >= totalFlashcards) {
          flashcards = flashcards.slice(0, totalFlashcards); // Trim to the desired total
          break;
        }
      } catch (parseError) {
        console.error("Failed to parse JSON:", jsonString);
        throw new Error("Parsing error");
      }
    } catch (error) {
      console.error("Error generating flashcards:", error.message);
      if (attempts >= maxAttempts - 1) {
        return NextResponse.json(
          {
            error:
              "An error occurred during the flashcard generation process. Please try again.",
          },
          { status: 500 }
        );
      }
    }
    attempts++;
  }

  return NextResponse.json({ flashcards });
}

// Utility function to sanitize and clean up JSON strings
function sanitizeJsonString(jsonString) {
  return jsonString
    .trim()
    .replace(/\n/g, "")
    .replace(/'/g, "'")
    .replace(/"/g, '"')
    .replace(/&/g, "&")
    .replace(/\r/g, "")
    .replace(/\t/g, "")
    .replace(/\b/g, "")
    .replace(/\f/g, "")
    .replace(/,\s*[\]}]/g, (match) => match.trim().slice(1));
}

// Function to extract JSON from the message content
function extractJsonString(messageContent) {
  const jsonStartIndex = messageContent.indexOf("{");
  const jsonEndIndex = messageContent.lastIndexOf("}") + 1;

  if (
    jsonStartIndex === -1 ||
    jsonEndIndex === -1 ||
    jsonEndIndex <= jsonStartIndex
  ) {
    throw new Error("Failed to extract JSON from OpenAI response.");
  }

  return messageContent.substring(jsonStartIndex, jsonEndIndex);
}

// Function to check if the JSON response is complete
function isJsonComplete(messageContent) {
  return (
    messageContent.trim().endsWith("}") && messageContent.includes('"back":')
  );
}
