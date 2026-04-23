import type { AppState } from "./AppState";
import { currentAppState } from "./internal/currentAppState";

/**
 * Sets a new application state
 * 
 * @param newState - The new application state to set
 * @returns The updated application state
 */
export function setAppState(newState: AppState): AppState {
  currentAppState.appState = newState;
  return currentAppState.appState;
}
