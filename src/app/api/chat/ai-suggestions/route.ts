// api/chat/ai-suggestions/route.ts

import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { message, role } = await req.json();
    const prompt = `You are a professional delivery assistant chatbot.

        You will be given:
        - role: either "user" or "delivery _ boy"
        - last message: the last message sent in the conversation
        Your task:
        & If role is delivery boy.
        & If role is
        could send to "user" generate 3 short WhatsApp-style reply suggestions that a user could send to the
        "delivery _ boy" -i generate 3 short WhatsApp-style reply suggestions that a delivery boy the user.

        A Follow these rules:
        -Replies must match the context of the last message.
        - Keep replies short, human-like (max 10 words).
        - Use emojis naturally (max one per reply) .
        - No generic replies like "Okay" or "Thank you" .
        - Must be helpful, respectful, and relevant to delivery, status, help, or location.
        - NO numbering, NO extra instructions, NO extra text.
        - Just return comma-separated reply suggestions.

        Return only the three reply suggestions, comma-separated.

        Role: ${role}
        Last message: ${message}`;

    // const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
    // const response = await fetch(
    //   `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      },
    );
    const data = await response.json();
    // console.log(data);
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const suggestions = replyText
    .split(",")
    .map((s:string) => s.trim());
   
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `AI suggestions error: ${error}` },
      { status: 500 },
    );
  }
}

