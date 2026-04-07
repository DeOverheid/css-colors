/**
 * Developer Mode Configuration
 *
 * Provides toggleable dev features for easier development/debugging.
 * Modular design allows adding more dev features without restructuring.
 *
 * Usage:
 *   const { devMode, isDevModeEnabled, toggleDevMode } = useDevMode()
 *   devMode.value.allStepsOpen // true = all steps expanded
 *   devMode.value.hideStepHeaders // true = hide step header bars
 */

export interface DevModeFlags {
    /** Master switch for dev mode */
    enabled: boolean;
    /** Keep all accordion steps open simultaneously */
    allStepsOpen: boolean;
    /** Hide step header divs to save vertical space */
    hideStepHeaders: boolean;
    // Future flags can be added here:
    // showDebugInfo: boolean;
    // skipAnimations: boolean;
    // logStateChanges: boolean;
}

const DEFAULT_FLAGS: DevModeFlags = {
    enabled: false, // Preview mode by default
    allStepsOpen: true,
    hideStepHeaders: true
};

// Singleton instance
let _instance: ReturnType<typeof createDevMode> | null = null;

function createDevMode() {
    const devMode = useState<DevModeFlags>("dev-mode", () => ({ ...DEFAULT_FLAGS }));

    /**
     * Check if dev mode is enabled (master switch)
     */
    const isDevModeEnabled = computed(() => devMode.value.enabled);

    /**
     * Check if all steps should be open
     * Only applies when dev mode is enabled
     */
    const shouldAllStepsBeOpen = computed(() =>
        devMode.value.enabled && devMode.value.allStepsOpen
    );

    /**
     * Check if step headers should be hidden
     * Only applies when dev mode is enabled
     */
    const shouldHideStepHeaders = computed(() =>
        devMode.value.enabled && devMode.value.hideStepHeaders
    );

    /**
     * Toggle the master dev mode switch
     */
    function toggleDevMode() {
        devMode.value.enabled = !devMode.value.enabled;
    }

    /**
     * Toggle a specific flag
     */
    function toggleFlag(flag: keyof Omit<DevModeFlags, "enabled">) {
        devMode.value[flag] = !devMode.value[flag];
    }

    /**
     * Set a specific flag value
     */
    function setFlag<K extends keyof DevModeFlags>(flag: K, value: DevModeFlags[K]) {
        devMode.value[flag] = value;
    }

    /**
     * Reset all flags to defaults
     */
    function resetToDefaults() {
        devMode.value = { ...DEFAULT_FLAGS };
    }

    /**
     * Disable dev mode and reset to production behavior
     */
    function disableDevMode() {
        devMode.value = {
            ...devMode.value,
            enabled: false
        };
    }

    return {
        devMode,
        isDevModeEnabled,
        shouldAllStepsBeOpen,
        shouldHideStepHeaders,
        toggleDevMode,
        toggleFlag,
        setFlag,
        resetToDefaults,
        disableDevMode
    };
}

/**
 * Dev mode composable - singleton pattern for shared state
 */
export function useDevMode() {
    if (!_instance) {
        _instance = createDevMode();
    }
    return _instance;
}
