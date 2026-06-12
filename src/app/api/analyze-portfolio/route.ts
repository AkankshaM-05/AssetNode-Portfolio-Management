import { NextResponse } from 'next/server';
import { generatePortfolioInsights } from '@/ai/flows/generate-portfolio-insights';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        console.log("📩 BODY RECEIVED:", body);

        // ✅ Validate input early
        if (!body?.investments || !Array.isArray(body.investments)) {
            console.error("❌ Invalid investments payload");
            return NextResponse.json(
                { error: "investments missing or invalid" },
                { status: 400 }
            );
        }

        console.log("🚀 BEFORE AI CALL");

        // 🔥 CALL AI FLOW
        const result = await generatePortfolioInsights({
            investments: body.investments
        });

        console.log("✅ AFTER AI CALL SUCCESS");
        console.log("🧾 AI RAW RESULT:", JSON.stringify(result, null, 2));

        // 🔒 SAFETY CHECK (VERY IMPORTANT)
        if (!result || !result.portfolioHealth) {
            console.error("❌ AI returned invalid response:", result);

            return NextResponse.json(
                {
                    error: "AI returned invalid response",
                    debug: result
                },
                { status: 500 }
            );
        }

        // ✅ FINAL RESPONSE
        return NextResponse.json(result);

    } catch (error: any) {
        console.error("🔥 API CRASH:", error);

        // ✅ Check for quota/rate-limit errors (by message)
        if (error?.message?.includes('RESOURCE_EXHAUSTED') ||
            error?.message?.includes('quota') ||
            error?.originalMessage?.includes('quota')) {
            return NextResponse.json(
                {
                    error: "API quota exceeded. Please try again in a few minutes.",
                    type: "QUOTA_EXCEEDED"
                },
                { status: 429 }
            );
        }

        // ✅ Generic error fallback
        return NextResponse.json(
            {
                error: "Analysis failed. Please try again.",
                message: error?.message || error?.originalMessage,
            },
            { status: 500 }
        );
    }
}