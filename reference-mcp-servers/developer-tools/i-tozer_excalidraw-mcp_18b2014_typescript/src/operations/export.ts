import { z } from 'zod';
import { ExcalidrawResourceNotFoundError } from '../common/errors.js';
import { getDrawing } from './drawings.js';

// Schema for exporting a drawing to SVG
export const ExportToSvgSchema = z.object({
  id: z.string().min(1),
});

// Schema for exporting a drawing to PNG
export const ExportToPngSchema = z.object({
  id: z.string().min(1),
  quality: z.number().min(0).max(1).optional().default(0.92),
  scale: z.number().min(0.1).max(5).optional().default(1),
  exportWithDarkMode: z.boolean().optional().default(false),
  exportBackground: z.boolean().optional().default(true),
});

// Schema for exporting a drawing to JSON
export const ExportToJsonSchema = z.object({
  id: z.string().min(1),
});

// Export a drawing to SVG
export async function exportToSvg(id: string): Promise<string> {
  try {
    // Get the drawing
    const drawing = await getDrawing(id);
    
    // Return the SVG content
    // Note: In a real implementation, we would use the Excalidraw API to convert the drawing to SVG
    // For now, we'll just return a placeholder
    return `<svg>
      <text x="10" y="20">Drawing: ${drawing.name}</text>
      <text x="10" y="40">This is a placeholder for the SVG export.</text>
    </svg>`;
  } catch (error) {
    if (error instanceof ExcalidrawResourceNotFoundError) {
      throw error;
    }
    throw new Error(`Failed to export drawing to SVG: ${(error as Error).message}`);
  }
}

// Export a drawing to PNG
export async function exportToPng(
  id: string,
  quality: number = 0.92,
  scale: number = 1,
  exportWithDarkMode: boolean = false,
  exportBackground: boolean = true
): Promise<string> {
  try {
    // Get the drawing
    const drawing = await getDrawing(id);
    
    // Return the PNG content as a base64 string
    // Note: In a real implementation, we would use the Excalidraw API to convert the drawing to PNG
    // For now, we'll just return a placeholder
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  } catch (error) {
    if (error instanceof ExcalidrawResourceNotFoundError) {
      throw error;
    }
    throw new Error(`Failed to export drawing to PNG: ${(error as Error).message}`);
  }
}

// Export a drawing to JSON
export async function exportToJson(id: string): Promise<string> {
  try {
    // Get the drawing
    const drawing = await getDrawing(id);
    
    // Return the JSON content
    return drawing.content;
  } catch (error) {
    if (error instanceof ExcalidrawResourceNotFoundError) {
      throw error;
    }
    throw new Error(`Failed to export drawing to JSON: ${(error as Error).message}`);
  }
}
