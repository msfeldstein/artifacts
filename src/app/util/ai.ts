"use server";
import { generateObject, generateText, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { createStreamableValue } from "ai/rsc";

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

export async function stream(prompt: string, useClaude: boolean = true) {
  let model: any = openai("gpt-4o");
  if (useClaude) {
    model = anthropic("claude-3-5-sonnet-20240620");
  }

  const stream = createStreamableValue("");

  (async () => {
    const { textStream } = await streamText({
      model,
      prompt,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
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
