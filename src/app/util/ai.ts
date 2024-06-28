"use server";
import { generateObject, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

export default async function generate(
  prompt: string,
  useClaude: boolean = true
) {
  let model: any = openai("gpt-4o");
  if (useClaude) {
    model = anthropic("claude-3-5-sonnet-20240620");
  }
  const { text } = await generateText({
    model,
    prompt,
  });
  return text;
}

export async function generateStructuredCode(
  prompt: string,
  useClaude: boolean = true
) {
  let model: any = openai("gpt-4o");
  if (useClaude) {
    model = anthropic("claude-3-5-sonnet-20240620");
  }
  const { object } = await generateObject({
    model,
    prompt,
    schema: z.object({
      code: z.string(),
      explanation: z.string(),
    }),
  });
  return object.code;
}
