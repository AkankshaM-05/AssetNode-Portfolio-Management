import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");

        if (!query) {
            return NextResponse.json([]);
        }

        const res = await fetch(
            `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}`
        );

        if (!res.ok) {
            return NextResponse.json([]);
        }

        const data = await res.json();

        const results = (data?.quotes || []).map((item: any) => ({
            name: item.longname || item.shortname || item.symbol,
            ticker: item.symbol,
            sector: item.sector || item.industry || "Unknown",
        }));

        return NextResponse.json(results);
    } catch (error) {
        console.error("STOCK SEARCH ERROR:", error);

        return NextResponse.json(
            [],
            { status: 500 }
        );
    }
}