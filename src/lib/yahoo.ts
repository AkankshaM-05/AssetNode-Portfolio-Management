import yahooFinance from "yahoo-finance2";

export async function getStockInfo(symbol: string) {
    try {
        const quote: any = await yahooFinance.quote(symbol);

        const summary: any = await yahooFinance.quoteSummary(symbol, {
            modules: ["price", "assetProfile"],
        });

        const priceModule = summary?.price;
        const profileModule = summary?.assetProfile;

        return {
            symbol,
            price: priceModule?.regularMarketPrice ?? quote?.regularMarketPrice ?? null,
            currency: priceModule?.currency ?? quote?.currency ?? "USD",
            sector: profileModule?.sector ?? "Unknown",
            industry: profileModule?.industry ?? "Unknown",
            marketCap: priceModule?.marketCap ?? null,
        };
    } catch (error) {
        console.error(error);

        return {
            symbol,
            price: null,
            currency: "USD",
            sector: "Unknown",
            industry: "Unknown",
            marketCap: null,
        };
    }
}