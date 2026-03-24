export function parseColor(input: string): { hue: number; saturation: number; lightness: number } | null {
    const trimmed = input.trim();

    // Parse HEX: #RRGGBB, #RGB, RRGGBB, RGB, or shorthand like f00
    const hexMatch = trimmed.match(/^#?([0-9a-fA-F]{3,3}|[0-9a-fA-F]{6,6})$/);
    if (hexMatch && hexMatch[1]) {
        let hex = hexMatch[1];
        if (hex.length === 3) {
            hex = hex[0]! + hex[0]! + hex[1]! + hex[1]! + hex[2]! + hex[2]!;
        }
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;
        return rgbToHsl(r, g, b);
    }

    // Parse RGB: rgb(r, g, b) or rgb(r g b) — with or without commas
    const rgbMatch = trimmed.match(/rgb\s*\(\s*(\d+)\s*[,\s]\s*(\d+)\s*[,\s]\s*(\d+)\s*\)/i);
    if (rgbMatch && rgbMatch[1] && rgbMatch[2] && rgbMatch[3]) {
        const r = parseInt(rgbMatch[1]) / 255;
        const g = parseInt(rgbMatch[2]) / 255;
        const b = parseInt(rgbMatch[3]) / 255;
        return rgbToHsl(r, g, b);
    }

    // Parse HSL: hsl(h, s%, l%) or hsl(h s% l%) — with or without commas
    const hslMatch = trimmed.match(/hsl\s*\(\s*(\d+)\s*[,\s]\s*(\d+)%?\s*[,\s]\s*(\d+)%?\s*\)/i);
    if (hslMatch && hslMatch[1] && hslMatch[2] && hslMatch[3]) {
        return {
            hue: parseInt(hslMatch[1]),
            saturation: parseInt(hslMatch[2]),
            lightness: parseInt(hslMatch[3])
        };
    }

    return null;
}

function rgbToHsl(r: number, g: number, b: number): { hue: number; saturation: number; lightness: number } {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }

    return {
        hue: Math.round(h * 360),
        saturation: Math.round(s * 100),
        lightness: Math.round(l * 100)
    };
}
