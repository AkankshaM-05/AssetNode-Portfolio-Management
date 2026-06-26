import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

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

            currency: "INR",

            sector: profileModule?.sector?.trim() || "Others",
        };

    } catch (error) {
        console.error(`Failed to get stock info for ${symbol}`, error);

        return {
            symbol: symbol.toUpperCase(),
            price: null,
            currency: "INR",
            sector: "Others",
        };
    }
}