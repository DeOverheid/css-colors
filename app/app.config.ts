export default defineAppConfig({
    ui: {
        colors: {
            neutral: "slate"
        }
    },
    colors: {
        hue: 186,
        saturation: 87,
        lightness: 66,
        mutedSaturationMultiplier: 0.1
    },
    bezier: {
        x1: 0.08,
        y1: 0.21,
        x2: 0.45,
        y2: 0.72
    },
    lightnessAdjustment: {
        enabled: true,
        darkening: {
            enabled: true,
            start: 30,
            end: 210,
            hueFalloff: 15,
            lightnessFalloffLight: 0.48,
            lightnessAmplitude: 9.5,
            lightnessFalloffDark: 0.44
        },
        brightening: {
            enabled: true,
            start: 210,
            end: 300,
            hueFalloff: 15,
            lightnessFalloffLight: 1,
            lightnessAmplitude: 12,
            lightnessFalloffDark: 0.2
        }
    }
});
