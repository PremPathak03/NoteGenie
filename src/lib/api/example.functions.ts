import { z } from "zod";

const greetingInputSchema = z.object({ name: z.string().min(1) });

export async function getGreeting({ data }: { data: { name: string } }) {
  const parsed = greetingInputSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Name is required.");
  }
  return {
    greeting: `Hello, ${parsed.data.name}!`,
    mode: import.meta.env.MODE ?? "unknown",
  };
}
