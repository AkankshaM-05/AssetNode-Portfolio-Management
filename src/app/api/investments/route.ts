import { getStockInfo } from "@/lib/getStockInfo";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET → fetch investments
export async function GET() {
    try {
        const { data, error } = await supabase
            .from("investments")
            .select("*");

        if (error) {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        const formattedData = (data || []).map((inv) => ({
            id: inv.id,
            assetType: "Stock",

            ticker: inv.ticker,
            sector: inv.sector,

            companyName: inv.company_name,

            quantity: Number(inv.quantity),
            buyPrice: Number(inv.buy_price),

            purchaseDate: inv.purchase_date,
        }));

        return NextResponse.json({
            success: true,
            data: formattedData,
        });

    } catch (err) {
        return NextResponse.json(
            { success: false, error: String(err) },
            { status: 500 }
        );
    }
}

// POST → add investment
export async function POST(req: Request) {
    try {
        const body = await req.json();

        // ONLY use fields that exist in Supabase table
        const {
            companyName,
            ticker,
            quantity,
            buyPrice,
            purchaseDate,
        } = body;
        const stockInfo = await getStockInfo(ticker);

        // validation
        if (
            !companyName ||
            quantity === undefined ||
            !buyPrice ||
            !purchaseDate
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Missing required fields",
                },
                { status: 400 }
            );
        }

        // insert into Supabase
        const { data, error } = await supabase
            .from("investments")
            .insert([
                {
                    user_id: "test-user",

                    ticker: ticker,
                    company_name: companyName,

                    quantity,
                    buy_price: buyPrice,

                    sector: stockInfo.sector || "Others",

                    purchase_date: purchaseDate,
                },
            ])
            .select();

        console.log("SUPABASE ERROR 👉", error);

        if (error) {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data,
        });

    } catch (err) {
        return NextResponse.json(
            { success: false, error: String(err) },
            { status: 500 }
        );
    }
}

// DELETE → remove investment
export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Investment ID required",
                },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from("investments")
            .delete()
            .eq("id", id);

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