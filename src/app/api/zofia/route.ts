import { NextRequest, NextResponse } from "next/server"
import { retrieve } from "@/lib/retrieve"
import { ZOFIA_SYSTEM_PROMPT } from "@/lib/zofiaPrompt"

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    const context = retrieve(message, 5)
    console.log(`✅ Found ${context.length} relevant documents`)
    const joined = context
      .map((c, i) => `[${i + 1}] ${c.title}\nURL: ${c.url}\n${c.snippet}`)
      .join("\n\n")
    console.log(`🧩 Context chars: ${joined.length}`)

    const userBlocks = [
      { type: "text", text: `Pytanie: ${message}` },
    ] as Array<{ type: "text"; text: string }>

    if (joined.length > 0) {
      userBlocks.push({ type: "text", text: `Kontekst:\n${joined}` })
    }

    const body = {
      model: "claude-3-5-sonnet-20241022",
      temperature: 0.3,
      max_tokens: 1024,
      system: ZOFIA_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: userBlocks,
        },
      ],
    }

    console.log("📡 Calling Anthropic API...")
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(body),
    })

    const data = await res.json()
    const answer = data.content?.[0]?.text
    
    if (!answer) {
      return NextResponse.json({ 
        answer: "Przepraszam, nie otrzymałam odpowiedzi od asystenta AI." 
      })
    }

    return NextResponse.json({ answer })
  } catch (error) {
    return NextResponse.json({ 
      answer: "Przepraszam, wystąpił błąd serwera. Spróbuj ponownie." 
    }, { status: 500 })
  }
}

