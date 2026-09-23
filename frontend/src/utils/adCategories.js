export const AD_CATEGORY_LABELS = {
    summer_offer: 'Nyári ajánlatok',
    winter_offer: 'Téli ajánlatok',
    spring_offer: 'Tavaszi ajánlatok',
    autumn_offer: 'Őszi ajánlatok',
    on_sale_offer: 'Akciós ajánlatok',
};

export const AD_STEP_LABELS = {
    templates: 'Sablonok',
    devices: 'Készülékek',
    text: 'Szöveg',
};

export function groupByCategory(items, categoryKey = 'category') {
    return items.reduce((groups, item) => {
        const key = item[categoryKey] || 'other';
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
        return groups;
    }, {});
}

export function groupAcUnitsByBrand(units) {
    return units.reduce((groups, unit) => {
        const brand = unit.brand || 'Egyéb';
        if (!groups[brand]) groups[brand] = [];
        groups[brand].push(unit);
        return groups;
    }, {});
}

export function formatAdPrice(value) {
    const num = Number(value);
    if (Number.isNaN(num)) return '';
    return num
        .toLocaleString('hu-HU', { maximumFractionDigits: 0 })
        .replace(/[\u00A0\u202F]/g, ' ');
}

export function parseDetailLines(text) {
    if (!text) return [];
    return text
        .split('\n')
        .map((line) => line.trim().replace(/^[-•*]\s*/, ''))
        .filter(Boolean);
}