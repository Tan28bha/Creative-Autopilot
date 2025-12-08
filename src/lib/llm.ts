// src/lib/llm.ts
import OpenAI from "openai";

export const localLlama = new OpenAI({
  apiKey: process.env.LOCAL_LLM_API_KEY || "dummy", // Ollama doesn't check this
  baseURL: process.env.LOCAL_LLM_BASE_URL || "http://localhost:11434/v1",
});

// You can change model name here if you like
export const LOCAL_LLAMA_MODEL = process.env.LOCAL_LLAMA_MODEL || "llama3.1";
