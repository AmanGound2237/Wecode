import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return Response.json({ error: "Invalid message" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
      systemInstruction:
        "You are the Wecode AI Tutor. Provide concise, helpful coding explanations. Keep answers brief.",
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return Response.json({ response: text });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return Response.json(
      { error: "Failed to generate AI response. Terminal connection lost." },
      { status: 500 }
    );
  }
}
