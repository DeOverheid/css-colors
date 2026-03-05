/**
 * Composable for click-to-copy functionality with visual feedback.
 * Returns a ref to bind to an element and a click handler.
 */
export function useClickToCopy() {
    const copied = ref(false);
    const copyTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

    async function copyText(text: string) {
        try {
            await navigator.clipboard.writeText(text);
            copied.value = true;

            // Clear previous timeout if any
            if (copyTimeout.value) {
                clearTimeout(copyTimeout.value);
            }

            // Reset copied state after feedback duration
            copyTimeout.value = setTimeout(() => {
                copied.value = false;
            }, 1500);

            return true;
        } catch (err) {
            console.error("Failed to copy text:", err);
            return false;
        }
    }

    // Cleanup on unmount
    onUnmounted(() => {
        if (copyTimeout.value) {
            clearTimeout(copyTimeout.value);
        }
    });

    return {
        copied,
        copyText
    };
}
