import { Investment } from './store';

export function calculateComposition(investments: Investment[]) {
    const map: Record<string, number> = {};

    let total = 0;

    investments.forEach((inv) => {
        const quantity = Number(inv.quantity || 0);
        const price = Number(inv.buyPrice || 0);

        if (quantity <= 0 || price <= 0) return;

        const sector = inv.sector?.trim() || 'Others';
        const value = quantity * price;

        total += value;

        map[sector] = (map[sector] || 0) + value;
    });

    if (total === 0) return {};

    const result: Record<string, number> = {};

    Object.entries(map).forEach(([sector, value]) => {
        result[sector] = Number(((value / total) * 100).toFixed(2));
    });

    return result;
}