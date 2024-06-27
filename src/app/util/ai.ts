"use server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

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
