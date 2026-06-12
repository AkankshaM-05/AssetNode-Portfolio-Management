import yahooFinance from "yahoo-finance2";

export async function getStockInfo(symbol: string) {
    try {
        const cleanSymbol = symbol.trim().toUpperCase();

        const quote: any = await yahooFinance.quote(cleanSymbol);

        const summary: any = await yahooFinance.quoteSummary(cleanSymbol, {
            modules: ["price", "assetProfile"],
        });

        const priceModule = summary?.price;
        const profileModule = summary?.assetProfile;

        return {
            symbol: cleanSymbol,

            price:
                priceModule?.regularMarketPrice ??
                quote?.regularMarketPrice ??
                null,

            currency:
                priceModule?.currency ??
                quote?.currency ??
                "USD",

            sector: profileModule?.sector ?? "Unknown",
            industry: profileModule?.industry ?? "Unknown",
            marketCap: priceModule?.marketCap ?? null,
        };

    } catch (error) {
        console.error(`Failed to get stock info for ${symbol}`, error);

        return {
            symbol: symbol.toUpperCase(),

            price: null,
            currency: "USD",
            sector: "Unknown",
            industry: "Unknown",
            marketCap: null,
        };
    }
}