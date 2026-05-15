📂 Phase 12.5 (Optional): Vector Persistence & Semantic Search
---

## 🎯 Phase Objective

Enable your API to perform **Semantic Search**—finding data based on meaning rather than just keywords. This phase provides the "Memory" for your RAG (Retrieval-Augmented Generation) pipeline. You will learn to generate mathematical representations of text (Embeddings) and store them in MongoDB for high-speed similarity retrieval.

---

## 📦 1. Core Dependency Installation

- **Type:** Optional Expansion
- **Action:** We need the same AI SDK (OpenAI or Gemini) to generate the vectors, and `mongoose` (already installed) to store them.

```bash
# Ensure you have your AI provider SDK installed (from Phase 12)
npm install openai
```

---

## 🏗️ 2. The Vector Schema (`src/models/knowledge.model.ts`)

- **Type:** App-Specific Expansion
- **Action:** Create a model to store your "Knowledge Base" items. The key is the `embedding` field, which stores an array of numbers (the vector).

```tsx
import mongoose, { Schema, Document } from 'mongoose';

export interface IKnowledge extends Document {
  content: string;    // The actual text snippet
  metadata: object;   // Source info (e.g., { file: "manual.pdf", page: 12 })
  embedding: number[]; // The vector representation (usually 1536 dimensions)
}

const knowledgeSchema = new Schema<IKnowledge>({
  content: { type: String, required: true },
  metadata: { type: Object },
  // This field must be indexed in MongoDB Atlas as a "vectorSearch" index
  embedding: { type: [Number], required: true },
}, { timestamps: true });

export const Knowledge = mongoose.model<IKnowledge>('Knowledge', knowledgeSchema);
```

---

## 🧠 3. The Embedding Service (`src/services/ai/embedding.service.ts`)

- **Type:** Universal Core for RAG
- **Action:** This service converts plain text into a vector.

```tsx
import { aiClient } from '../../config/ai'; // Reusing client from Phase 12
import { AppError } from '../../utils/AppError';

export const generateEmbedding = async (text: string): Promise<number[]> => {
  try {
    const response = await aiClient.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return response.data[0].embedding;
  } catch (error: any) {
    throw new AppError(`Embedding Generation Failed: ${error.message}`, 502);
  }
};
```

---

## 🔍 4. The Vector Search Service (`src/services/ai/vectorStore.service.ts`)

- **Type:** Universal Core for RAG
- **Action:** This uses MongoDB's `$vectorSearch` stage to find the most relevant snippets for a user's query.

```tsx
import { Knowledge } from '../../models/knowledge.model';
import { generateEmbedding } from './embedding.service';

export const findRelevantContext = async (query: string, limit: number = 3) => {
  // 1. Convert the user's question into a vector
  const queryVector = await generateEmbedding(query);

  // 2. Perform a Vector Search in MongoDB
  const results = await Knowledge.aggregate([
    {
      $vectorSearch: {
        index: "vector_index", // The name of the index you create in Atlas
        path: "embedding",
        queryVector: queryVector,
        numCandidates: 100,
        limit: limit,
      }
    },
    {
      $project: {
        _id: 0,
        content: 1,
        score: { $meta: "vectorSearchScore" } // Get the similarity score
      }
    }
  ]);

  // Combine the results into a single string for the LLM
  return results.map(r => r.content).join("\n\n");
};
```

---

## 🔗 5. Integrating with Phase 12 (The RAG Adapter)

- **Type:** The "Genius" Connection
- **Action:** Now, update your `rag.adapter.ts` from Phase 12 to use the real database instead of mocks.

```tsx
// src/services/ai/adapters/rag.adapter.ts
import { IAIService, IGenerateInput } from '../ai.interface';
import { openAIAdapter } from './openai.adapter';
import { findRelevantContext } from '../vectorStore.service'; // <-- REAL SEARCH

export const ragPipelineAdapter: IAIService = {
  async generateText(input: IGenerateInput): Promise<string> {
    // 1. Get real context from your Vector DB
    const context = await findRelevantContext(input.prompt);

    // 2. Build the augmented prompt
    const enrichedPrompt = `
      Use the following context to answer the user query. 
      If the answer is not in the context, say you don't know.

      Context: 
      ${context}

      User Query: 
      ${input.prompt}
    `;

    // 3. Pass to the standard LLM adapter
    return await openAIAdapter.generateText({
      ...input,
      prompt: enrichedPrompt,
    });
  },
  
  // streamText follows the same pattern...
  async streamText(input: IGenerateInput) { ... }
};
```

---

## 📝 6. Manual Setup Step (Atlas UI)

Unlike standard indexes, **Vector Indexes** must currently be created via the MongoDB Atlas UI or API.

1. Go to **Atlas Search** in your cluster.
2. Create a new Index using the **JSON Editor**.
3. Use this configuration:

```json
{
  "fields": [
    {
      "numDimensions": 1536,
      "path": "embedding",
      "similarity": "cosine",
      "type": "vector"
    }
  ]
}
```

---

## 🔍 Next Steps Checklist

- [ ]  Create the `Knowledge` model.
- [ ]  Implement `generateEmbedding` to talk to your AI provider.
- [ ]  Implement `vectorStore.service` to perform the `$vectorSearch`.
- [ ]  Connect `vectorStore` to your `ragPipelineAdapter` in Phase 12.
- [ ]  **Test:** Create a "Seed" script to upload some text data with embeddings, then ask the AI a question about that specific data.

---