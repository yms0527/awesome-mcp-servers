import { getAppState } from "@features/app-state/getAppState";
import { createExpressApp } from "./internal/createExpressApp";

/**
 * Sets up the REST server for handling API requests
 */
export function setupRestServer(): void {
  const { app } = createExpressApp();

  // Get the most current application state for the port
  const { restHttpPort } = getAppState();

  // Start the server
  app.listen(restHttpPort, () => {
    console.error(`REST Server running on port ${restHttpPort}`);
    console.error(
      `API documentation available at http://localhost:${restHttpPort}/api-docs`
    );
  });
}
