/**
 * Feature & Swatch Unlock
 * Tracks which features/rows have been unlocked by visiting steps.
 * Once unlocked, an item stays unlocked even if the user returns to a previous step.
 */
import type { StepDefinition } from "./stepRegistry";

export function useSwatchUnlock() {
    const unlockedItems = useState<string[]>("unlocked-items", () => ["primary", "grey", "neutral"]);

    function visitStep(step: StepDefinition) {
        if (step.unlocks) {
            for (const item of step.unlocks) {
                if (!unlockedItems.value.includes(item)) {
                    unlockedItems.value.push(item);
                }
            }
        }
    }

    function isUnlocked(itemId: string): boolean {
        return unlockedItems.value.includes(itemId);
    }

    return {
        unlockedRows: unlockedItems,
        visitStep,
        isUnlocked
    };
}
