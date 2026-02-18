/**
 * Provides access to app configuration
 * Values are defined in app.config.ts and themes
 */
export function useConfig() {
    const appConfig = useAppConfig();

    return {
        colors: {
            hue: appConfig.colors?.hue,
            saturation: appConfig.colors?.saturation,
            lightness: appConfig.colors?.lightness,
            mutedSaturationMultiplier: appConfig.colors?.mutedSaturationMultiplier
        },
        bezier: {
            x1: appConfig.bezier?.x1,
            y1: appConfig.bezier?.y1,
            x2: appConfig.bezier?.x2,
            y2: appConfig.bezier?.y2
        }
    };
}
