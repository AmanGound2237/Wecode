import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TRANSFORMER_SUMMARY = `
Attention Is All You Need

Abstract
The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train. 

1. Introduction
Self-attention, sometimes called intra-attention is an attention mechanism relating different positions of a single sequence in order to compute a representation of the sequence.

3. Model Architecture
Most competitive neural sequence transduction models have an encoder-decoder structure. 
3.1 Encoder and Decoder Stacks
Encoder: The encoder is composed of a stack of N=6 identical layers. Each layer has two sub-layers. The first is a multi-head self-attention mechanism, and the second is a simple, position-wise fully connected feed-forward network. We employ a residual connection around each of the two sub-layers, followed by layer normalization.
Decoder: The decoder is also composed of a stack of N=6 identical layers. In addition to the two sub-layers in each encoder layer, the decoder inserts a third sub-layer, which performs multi-head attention over the output of the encoder stack.

3.2 Attention
An attention function can be described as mapping a query and a set of key-value pairs to an output.
Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V
Multi-Head Attention allows the model to jointly attend to information from different representation subspaces at different positions.
`;

async function main() {
  console.log("========================================");
  console.log("🚀 Testing 'Code with AI' Backend Pipeline");
  console.log("========================================");
  
  // Need to start local dev server or just mock the route execution.
  // Since we want to hit the API route over HTTP, we'll assume standard NEXT.js DEV server is running on localhost:3000
  // Wait, if the user doesn't have the server running, let's just make the fetch request to localhost:3000.
  
  console.log("> Fetching from http://localhost:3000/api/papers/breakdown...");
  
  try {
    const response = await fetch("http://localhost:3000/api/papers/breakdown", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: TRANSFORMER_SUMMARY })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    console.log("\n✅ Pipeline Succeeded!");
    console.log(`Title: ${result.paper.title}`);
    console.log(`Generated ${result.paper.prerequisites.length} Prerequisites.`);
    console.log(`Generated ${result.paper.steps.length} Implementation Steps.`);
    
    console.log("\nSample Step 1 (Starter Code):");
    console.log(result.paper.steps[0].starterCode);
    
  } catch (err: any) {
    if (err.message.includes("ENOTFOUND") || err.message.includes("ECONNREFUSED")) {
      console.error("❌ Could not connect to localhost:3000. Please make sure the Next.js dev server is running.");
      console.log("Command: npm run dev");
    } else {
      console.error("❌ Pipeline Failed:", err.message);
    }
  }
}

main().catch(console.error);
