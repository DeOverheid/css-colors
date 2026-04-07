/**
 * Shared state for user-entered lightness from color input.
 * Eliminates prop drilling between generator.vue → GeneratorInput → ColorInputControls.
 */
export function useUserInputLightness() {
    return useState<number | null>("user-input-lightness", () => null);
}
