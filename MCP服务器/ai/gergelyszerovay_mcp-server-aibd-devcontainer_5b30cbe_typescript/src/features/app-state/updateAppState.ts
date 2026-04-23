import type { AppState } from "./AppState";
import { currentAppState } from "./internal/currentAppState";
import { setAppState } from "./setAppState";

/**
 * Updates specific properties of the application state
 * 
 * @param updates - Partial updates to apply to the application state
 * @returns The updated application state
 */
export function updateAppState(updates: Partial<AppState>): AppState {
  if (!currentAppState.appState) {
    throw new Error("Application state has not been initialized");
  }
  
  // Create a new immutable state object with the updates
  const newState: AppState = {
    ...currentAppState.appState,
    ...updates,
  };
  
  return setAppState(newState);
}
