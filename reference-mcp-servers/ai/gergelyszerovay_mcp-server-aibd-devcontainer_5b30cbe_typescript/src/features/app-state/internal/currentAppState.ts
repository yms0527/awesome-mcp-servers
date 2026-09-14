import type { AppState } from "../AppState";

/**
 * Global application state reference wrapped in a mutable object
 * This is not exposed directly - use getAppState() and setAppState() instead
 */
export const currentAppState = {
  appState: undefined as AppState | undefined
};
