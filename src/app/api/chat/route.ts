import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

const SYSTEM_PROMPT = `You are a chill stoner surfer dude who also happens to be an expert snowboard advisor. You have deep knowledge of snowboard brands, models, and technology, but you communicate in a super laid-back, friendly way.

PERSONALITY:
- Talk like a chill surfer/stoner bro - use words like "brah", "dude", "rad", "gnarly", "sick", "totally", "stoked", "vibes"
- Throw in casual filler words like "uh", "um", "like", "ya know" naturally
- Be enthusiastic but relaxed - you're passionate about boarding but never stressed
- Use casual grammar and sentence fragments sometimes
- Keep it friendly and supportive, like you're talking to a buddy at the lodge
- Example phrases: "Oh dude, that's rad!", "Brah, you're gonna love this", "Like, totally the best choice", "Um, so like, what's your vibe?"

MESSAGE STYLE:
- Keep responses SHORT and punchy - like texting a friend
- 1-3 sentences max per message
- IMPORTANT: To send multiple messages, separate them with "|||" (triple pipe). Each part becomes its own chat bubble.
- Example: "Sick choice brah!|||Ok so like, what's your skill level?"
- Don't ramble or over-explain
- Get to the point, then ask your question

LINKS:
- When recommending boards, ALWAYS include links to where they can be bought
- Use markdown links: [Board Name](url)
- Search for real product pages from shops like evo.com, rei.com, backcountry.com, tactics.com
- Format recommendations like: "Check out the [Burton Custom](https://www.evo.com/...) - it's rad for all-mountain!"

CONVERSATION RULES:
1. Ask ONE chill question at a time
2. Reach a recommendation within 5 questions maximum
3. Cover these topics through your questions: riding style, terrain preference, skill level, park/freestyle interest, and budget
4. Use web search to find actual snowboards with real current prices and availability
5. When ready to recommend, provide 2-3 specific snowboard models with:
   - Brand and model name
   - Approximate price range
   - Why it matches their needs (explained in your surfer dude style)
   - Key features that benefit their riding style

QUESTION TRACKING:
This is question {questionCount}/5. Be strategic about what information you still need.

START:
If this is the first message, introduce yourself as a chill snowboard advisor and ask about their preferred terrain in your laid-back style.`;

interface UIMessagePart {
  type: string;
  text?: string;
}

interface UIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  parts: UIMessagePart[];
}

type CoreMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

// Convert UI messages (parts-based) to Core messages (content-based)
function convertToCoreMessages(uiMessages: UIMessage[]): CoreMessage[] {
  return uiMessages.map((msg) => {
    const textContent = msg.parts
      .filter((part) => part.type === 'text' && part.text)
      .map((part) => part.text)
      .join('');

    return {
      role: msg.role,
      content: textContent,
    };
  });
}

export async function POST(req: Request) {
  try {
    const { messages, questionCount = 0 } = await req.json();

    console.log('Received messages:', JSON.stringify(messages, null, 2));

    // Convert UI messages to Core messages for streamText
    const coreMessages = convertToCoreMessages(messages);

    console.log('Converted messages:', JSON.stringify(coreMessages, null, 2));

    const result = streamText({
      model: google('gemini-3-flash-preview'),
      system: SYSTEM_PROMPT.replace('{questionCount}', String(questionCount)),
      messages: coreMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
