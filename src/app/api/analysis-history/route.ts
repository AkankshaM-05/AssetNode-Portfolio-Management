import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    try {
        const { data, error } = await supabase
            .from("analysis_history")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            return NextResponse.json(
                {
                    success: false,
                    error: error.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data,
        });

    } catch (err) {
        return NextResponse.json(
            {
                success: false,
                error: String(err),
            },
            { status: 500 }
        );
    }
}