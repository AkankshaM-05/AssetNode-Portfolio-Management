import { Investment } from './store';

export function calculateComposition(investments: Investment[]) {
    const total = investments.reduce(
        (sum, inv) => sum + inv.quantity * inv.buyPrice,
        0
    );

    const sectors: Record<string, number> = {
        Technology: 0,
        Financials: 0,
        Others: 0,
    };

    investments.forEach((inv) => {
        const value = inv.quantity * inv.buyPrice;

        const name = inv.companyName.toLowerCase();

        if (name.includes("apple") || name.includes("microsoft") || name.includes("tesla") || name.includes("nvidia")) {
            sectors.Technology += value;
        }
        else if (name.includes("hdfc") || name.includes("bank") || name.includes("bajaj")) {
            sectors.Financials += value;
        }
        else {
            sectors.Others += value;
        }
    });

    return {
        Technology: Math.round((sectors.Technology / total) * 100) || 0,
        Financials: Math.round((sectors.Financials / total) * 100) || 0,
        Others: Math.round((sectors.Others / total) * 100) || 0,
    };
}