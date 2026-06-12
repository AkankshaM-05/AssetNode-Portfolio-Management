import { Investment } from './store';

export function calculateComposition(investments: Investment[]) {
    const valid = investments.filter(
        (inv) =>
            inv.quantity > 0 &&
            inv.buyPrice > 0 &&
            inv.sector
    );

    const total = valid.reduce(
        (sum, inv) => sum + inv.quantity * inv.buyPrice,
        0
    );

    if (total === 0) return {};

    const map: Record<string, number> = {};

    valid.forEach((inv) => {
        const value = inv.quantity * inv.buyPrice;
        const sector = inv.sector || 'Others';

        map[sector] = (map[sector] || 0) + value;
    });

    const result: Record<string, number> = {};

    Object.keys(map).forEach((sector) => {
        result[sector] = Number(((map[sector] / total) * 100).toFixed(2));
    });

    return result;
}