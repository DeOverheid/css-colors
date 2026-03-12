/**
 * Swatch Unlock
 * Tracks which swatch rows have been unlocked by visiting steps.
 * Once unlocked, a row stays unlocked even if the user returns to a previous step.
 */
import type { StepDefinition } from "./stepRegistry";

export function useSwatchUnlock() {
    const unlockedRows = useState<string[]>("unlocked-swatch-rows", () => ["primary"]);

    function visitStep(step: StepDefinition) {
        if (step.unlocks) {
            for (const row of step.unlocks) {
                if (!unlockedRows.value.includes(row)) {
                    unlockedRows.value.push(row);
                }
            }
        }
    }

    function isUnlocked(rowId: string): boolean {
        return unlockedRows.value.includes(rowId);
    }

    return {
        unlockedRows,
        visitStep,
        isUnlocked
    };
}
