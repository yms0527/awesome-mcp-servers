import type { Express, Request, Response, NextFunction } from "express";

/**
 * Parameters for configuring error handling
 */
type ConfigureErrorHandlingParams = {
  /** Express application instance */
  app: Express;
};

/**
 * Configures global error handling for the Express application
 * 
 * @param params - Configuration parameters
 */
export function configureErrorHandling({ app }: ConfigureErrorHandlingParams): void {
  // Global error handling middleware
  app.use(
    (
      err: Error,
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      console.error("Global error handler caught:", err);
      res.status(500).json({
        error: "Server error",
        message: err.message || "An unexpected error occurred",
      });
    }
  );

  // 404 handler for undefined routes
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: "Not Found",
      message: `Route ${req.method} ${req.path} not found`,
    });
  });
}
