const normalizeText = (value) => {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};

module.exports = { normalizeText };