import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION = `You are ConsultLegal AI, an expert legal assistant specializing in Indian law. You provide accurate, helpful legal information based on Indian legal frameworks including:

- Indian Contract Act, 1872
- Companies Act, 2013
- Indian Penal Code
- Code of Civil Procedure
- Code of Criminal Procedure
- Constitution of India
- Consumer Protection Act, 2019
- Intellectual Property laws (Patents, Trademarks, Copyright)
- Labour laws and employment regulations
- Real Estate (Regulation and Development) Act, 2016
- Information Technology Act, 2000
- Goods and Services Tax (GST) laws

Important guidelines:
1. Always cite relevant acts and sections when applicable
2. Clarify that you provide legal information, not legal advice
3. Recommend consulting a qualified lawyer for specific situations
4. Be precise about jurisdiction (primarily Indian law)
5. If unsure, say so rather than providing incorrect information
6. Use clear, accessible language while maintaining legal accuracy
7. Format your responses using Markdown for better readability (use **bold**, *italics*, bullet points, numbered lists, headings as appropriate)`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const isStreaming = req.nextUrl.searchParams.get("stream") === "true";

    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    // Split history vs last message
    const historyMessages = messages.slice(0, -1);
    const lastMessage = messages[messages.length - 1];

    const geminiHistory = historyMessages.map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })
    );

    const chat = model.startChat({ history: geminiHistory });

    if (isStreaming) {
      // Streaming response via Server-Sent Events
      const streamResult = await chat.sendMessageStream(lastMessage?.content || "");

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of streamResult.stream) {
              const text = chunk.text();
              if (text) {
                const data = `data: ${JSON.stringify({ delta: text })}\n\n`;
                controller.enqueue(encoder.encode(data));
              }
            }
            // Send [DONE] signal
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          } catch (err) {
            const errMsg = err instanceof Error ? err.message : "Stream error";
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errMsg })}\n\n`));
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Non-streaming fallback
    const result = await chat.sendMessage(lastMessage?.content || "");
    const responseText = result.response.text();

    return NextResponse.json({
      content: responseText,
      model: modelName,
      tokensUsed: result.response.usageMetadata?.totalTokenCount || 0,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[/api/chat] Gemini error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
