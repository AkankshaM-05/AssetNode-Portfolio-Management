import { supabase } from "@/lib/supabase";
import { NextResponse } from 'next/server';
import { generatePortfolioInsights } from '@/ai/flows/generate-portfolio-insights';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Input validation (slightly stronger)
        if (
            !body?.investments ||
            !Array.isArray(body.investments) ||
            body.investments.length === 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: "INVALID_INPUT",
                    message: "Investments missing or empty",
                },
                { status: 400 }
            );
        }

        // (optional safety) normalize input
        const sanitizedInvestments = body.investments.map((inv: any) => ({
            assetType: inv.assetType,
            companyName: inv.companyName,
            quantity: Number(inv.quantity),
            buyPrice: Number(inv.buyPrice),
            purchaseDate: new Date(inv.purchaseDate).toISOString(),
        }));

        // AI call
        const result = await generatePortfolioInsights({
            investments: sanitizedInvestments,
        });

        if (!result || !result.portfolioHealth) {
            return NextResponse.json(
                {
                    success: false,
                    error: "INVALID_AI_RESPONSE",
                    message: "AI returned incomplete data",
                },
                { status: 500 }
            );
        }

        await supabase
            .from("analysis_history")
            .insert([
                {
                    user_id: "test-user",
                    status: result.portfolioHealth.overallStatus,
                    summary: result.portfolioHealth.summary,
                },
            ]);

        // AI response validation
        if (!result || !result.portfolioHealth) {
            return NextResponse.json(
                {
                    success: false,
                    error: "INVALID_AI_RESPONSE",
                    message: "AI returned incomplete data",
                },
                { status: 500 }
            );
        }

        // consistent response shape
        return NextResponse.json({
            success: true,
            data: result,
        });

    } catch (error: any) {
        console.error("🔥 ANALYSIS API ERROR:", error);

        const message = error?.message || "";
        const status = error?.status || error?.code;

        const isQuotaError =
            status === 429 ||
            message.includes("RESOURCE_EXHAUSTED") ||
            message.includes("quota") ||
            message.includes("RateLimit") ||
            message.includes("PerMinutePerProject");

        if (isQuotaError) {
            return NextResponse.json(
                {
                    success: false,
                    error: "AI_QUOTA_EXCEEDED",
                    message: "AI limit reached for now. Please wait a few minutes and try again.",
                },
                { status: 429 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: "ANALYSIS_FAILED",
                message: "We couldn't complete the analysis right now. Please try again shortly.",
            },
            { status: 500 }
        );
    }
}