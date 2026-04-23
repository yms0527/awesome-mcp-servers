import type { AppState } from "./AppState";
import { setAppState } from "./setAppState";

/**
 * Internal function to initialize the application state
 * This should only be called once during application startup
 * 
 * @param initialState - The initial application state
 * @returns The initialized application state
 * @internal
 */
export function initializeAppState(initialState: AppState): AppState {
  return setAppState(initialState);
}
