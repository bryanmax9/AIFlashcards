import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are a flashcard creator. Your goal is to generate concise and effective flashcards that help users quickly grasp and retain key concepts. Each flashcard should have:

1. **A Clear and Focused Question:** This could be a direct question, a fill-in-the-blank statement, or a prompt for a concept explanation.
2. **A Concise Answer:** Provide a brief, accurate, and to-the-point response to the question. If necessary, include a short explanation or key details.
3. **Key Terms and Concepts:** Highlight any important terms, dates, formulas, or definitions that are essential to understanding the material.
4. **Example or Application (Optional):** When relevant, include a practical example or scenario that demonstrates the concept in action.
5. **Topic Labeling:** Assign a topic or category to each flashcard for easy organization and review.
6. Only generate 10 flashcards.

Ensure that each flashcard is easy to understand and designed to reinforce learning effectively. Avoid unnecessary details or overly complex language.

Return in the following JSON format without any trailing commas:
{
  "flashcards": [
    {
      "front": "question",
      "back": "answer"
    }
  ]
}
`;

export async function POST(req) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const baseUrl = "https://openrouter.ai/api/v1";

    const data = await req.text();

    const client = new OpenAI({
      baseURL: baseUrl,
      apiKey: apiKey,
    });

    const completion = await client.chat.completions.create({
      model: "nousresearch/hermes-3-llama-3.1-405b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: data },
      ],
      response_format: "json",
    });

    const messageContent = completion.choices?.[0]?.message?.content;

    if (!messageContent) {
      console.error("Unexpected API response:", completion);
      throw new Error("Invalid response from OpenAI");
    }

    const jsonStartIndex = messageContent.indexOf("{");
    const jsonEndIndex = messageContent.lastIndexOf("}") + 1;

    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      console.error(
        "Failed to extract JSON. Content received:",
        messageContent
      );
      throw new Error("Failed to extract JSON from OpenAI response");
    }

    const jsonString = messageContent.substring(jsonStartIndex, jsonEndIndex);

    let flashcards;
    try {
      flashcards = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse JSON:", jsonString);
      throw new Error("Failed to parse OpenAI response as JSON");
    }

    // Validate the flashcards structure
    if (
      !Array.isArray(flashcards.flashcards) ||
      flashcards.flashcards.some(
        (fc) => typeof fc.front !== "string" || typeof fc.back !== "string"
      )
    ) {
      console.error("Invalid flashcard structure:", flashcards);
      throw new Error("Invalid flashcard structure");
    }

    return NextResponse.json({ flashcards: flashcards.flashcards });
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json(
      { error: "Failed to generate flashcards" },
      { status: 500 }
    );
  }
}
