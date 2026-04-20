import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType, Schema } from "@google/generative-ai";
import { prisma } from "@/lib/db";

// Use the API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Enforce Structured Output via JSON Schema
const breakdownSchema: Schema = {
  description: "A structured educational breakdown of an AI research paper.",
  type: SchemaType.OBJECT,
  properties: {
    title: {
      type: SchemaType.STRING,
      description: "The name of the research paper.",
    },
    authors: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "List of paper authors.",
    },
    abstract: {
      type: SchemaType.STRING,
      description: "A simplified, highly readable summary of the core ideas.",
    },
    prerequisites: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          resourceType: { type: SchemaType.STRING, description: "e.g., 'concept', 'math', 'framework'" }
        },
        required: ["title", "description", "resourceType"],
      },
      description: "The foundational AI/ML knowledge required to understand this paper.",
    },
    implementationSteps: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING, description: "Clear coding task for the user to implement." },
          starterCode: { type: SchemaType.STRING, description: "Python boilerplate/starter code for this step." },
          hints: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "Hints progressively guiding the user toward the solution."
          }
        },
        required: ["title", "description", "starterCode", "hints"],
      },
      description: "A progressive, step-by-step coding curriculum to build the paper from scratch.",
    },
  },
  required: ["title", "authors", "abstract", "prerequisites", "implementationSteps"],
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const pdfFile = formData.get("pdfFile") as File | null;

    if (!pdfFile) {
      return NextResponse.json({ error: "No PDF file provided" }, { status: 400 });
    }

    console.log(`[Pipeline] Sending raw PDF directly to Gemini via Multimodality API: ${pdfFile.name}`);
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdfBase64 = Buffer.from(arrayBuffer).toString("base64");

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
    }

    // 1. Analyze with Gemini 1.5 Pro
    console.log("[Pipeline] Starting Gemini multimodality analysis...");
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: "You are an expert AI Architect and Educator. Your task is to read the provided research paper PDF and break it down into an interactive coding curriculum. Output your curriculum strictly matching the provided JSON schema.",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: breakdownSchema,
      },
    });

    const result = await model.generateContent([
      {
        inlineData: {
          data: pdfBase64,
          mimeType: "application/pdf"
        }
      }
    ]);
    const jsonString = result.response.text();
    const data = JSON.parse(jsonString);
    console.log("[Pipeline] Gemini analysis complete.");

    // 2. We need a user to assign the paper to. 
    // Usually this comes from session, but for our backend test we'll grab or create a dummy user.
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "admin-pipeline-test@wecode.local",
          passwordHash: "test_hash"
        }
      });
    }

    // 3. Save to database using Prisma
    console.log("[Pipeline] Saving to database...");
    const paper = await prisma.researchPaper.create({
      data: {
        userId: user.id,
        title: data.title,
        authors: data.authors,
        abstract: data.abstract,
        rawContent: "[ RAW PDF STREAM SENT EXCLUSIVELY VIA NEXT.JS MULTIMODALITY ]",
        status: "READY",
        prerequisites: {
          create: data.prerequisites.map((p: any, i: number) => ({
            title: p.title,
            description: p.description,
            resourceType: p.resourceType,
            order: i,
          })),
        },
        steps: {
          create: data.implementationSteps.map((s: any, i: number) => ({
            title: s.title,
            description: s.description,
            starterCode: s.starterCode,
            hints: s.hints,
            order: i,
          })),
        },
      },
      include: {
        prerequisites: true,
        steps: true,
      }
    });

    console.log(`[Pipeline] Saved! Paper ID: ${paper.id}`);

    return NextResponse.json({ success: true, paper });

  } catch (error: any) {
    console.error("[Pipeline] Error processing paper:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
