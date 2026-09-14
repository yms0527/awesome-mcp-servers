import type { AppState } from "./AppState";
import { currentAppState } from "./internal/currentAppState";

/**
 * Gets the current application state
 * 
 * @returns The current application state
 */
export function getAppState(): AppState {
  if (!currentAppState.appState) {
    throw new Error("Application state has not been initialized");
  }
  return currentAppState.appState;
}
