import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider, DEFAULT_MODEL } from "./ai-gateway";

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key)(DEFAULT_MODEL);
}

const emailSchema = z.object({
  purpose: z.string().min(3).max(2000),
  tone: z.enum(["formal", "friendly", "persuasive"]),
  audience: z.enum(["manager", "client", "team member"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => emailSchema.parse(d))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are an expert business communication coach. Write polished, ready-to-send emails. Output ONLY the email itself with a subject line on the first line as 'Subject: ...'. No preamble, no explanation.",
      prompt: `Write a ${data.tone} email to a ${data.audience}.

Purpose / context:
${data.purpose}

Requirements:
- Start with: Subject: <clear subject>
- Then a blank line
- Then greeting, 1–3 short paragraphs, clear call-to-action, sign-off
- Match the ${data.tone} tone consistently
- Keep it concise and professional`,
    });
    return { text };
  });

const notesSchema = z.object({ notes: z.string().min(20).max(20000) });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => notesSchema.parse(d))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You convert raw meeting notes into structured executive summaries. Output well-formed markdown ONLY, no preamble.",
      prompt: `Summarize the following meeting notes using this exact markdown structure:

## Summary
2–3 sentence overview.

## Key Discussion Points
- Bullet points

## Decisions
- Decision 1
- Decision 2

## Action Items
| Task | Owner | Deadline |
|------|-------|----------|
| ... | ... | ... |

## Open Questions
- ...

Meeting notes:
"""
${data.notes}
"""`,
    });
    return { text };
  });

const plannerSchema = z.object({
  tasks: z.string().min(5).max(5000),
  range: z.enum(["day", "week"]),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => plannerSchema.parse(d))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are a productivity coach using the Eisenhower matrix and time-blocking. Output markdown ONLY.",
      prompt: `Build a ${data.range === "day" ? "daily" : "weekly"} plan from these tasks:

"""
${data.tasks}
"""

Structure your response as markdown:

## Prioritization (Eisenhower Matrix)
**Do First (Urgent + Important):** ...
**Schedule (Important, Not Urgent):** ...
**Delegate (Urgent, Not Important):** ...
**Eliminate (Neither):** ...

## ${data.range === "day" ? "Time-Blocked Schedule" : "Weekly Plan"}
${
  data.range === "day"
    ? "Provide a realistic hour-by-hour block from 9:00 to 18:00 including breaks."
    : "Provide a Mon–Fri breakdown with 2–4 priorities per day."
}

## Time Management Tips
3 concrete, tailored tips.`,
    });
    return { text };
  });

const researchSchema = z.object({ topic: z.string().min(3).max(10000) });

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => researchSchema.parse(d))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are a senior research analyst. Produce concise, structured briefings in markdown ONLY. Be specific; avoid fluff.",
      prompt: `Research and analyze the following topic or text. Provide a briefing using this exact structure:

## Overview
2–3 sentence summary.

## Key Insights
- 4–6 insights, each with a 1-line explanation.

## Implications
- What this means in practice.

## Recommendations
- 3 concrete next steps.

## Caveats
- What's uncertain or context-dependent.

Topic / source text:
"""
${data.topic}
"""`,
    });
    return { text };
  });
