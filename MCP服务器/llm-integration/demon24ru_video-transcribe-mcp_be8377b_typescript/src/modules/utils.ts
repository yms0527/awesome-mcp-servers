import { io, Socket } from "socket.io-client";

// Configuration
export const SERVER_URL = process.env.MCP_VIDEO_TRANSCRIBE_SERVER_URL || 'http://localhost:5000';

// Socket.IO client instance
let socket: Socket | null = null;
let isConnected = false;

/**
 * Initialize Socket.IO connection
 */
export function initializeSocket(): Promise<Socket> {
  return new Promise((resolve, reject) => {
    if (socket && isConnected) {
      resolve(socket);
      return;
    }

    // Create new socket connection
    socket = io(SERVER_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Set up event handlers
    socket.on('connect', () => {
      isConnected = true;
      resolve(socket!);
    });

    socket.on('connect_error', (error) => {
      if (!isConnected) {
        reject(error);
      }
    });

    socket.on('disconnect', () => {
      isConnected = false;
    });
  });
}

/**
 * Send a message to the Optivus server and wait for a response
 * 
 * @param message - The message to send
 * @returns Promise resolving to the server response
 */
export async function sendMessage(message: any): Promise<any> {
  try {
    const socketInstance = await initializeSocket();
    
    return new Promise((resolve, reject) => {
      // Set up a one-time message handler for the response
      socketInstance.once('message', (response) => {
        if (response.status === '200') {
          resolve(response.data);
          closeConnection();
          return;
        } else {
          reject(new Error(`Server error: ${JSON.stringify(response)}`));
        }
      });
      
      // Send the message
      socketInstance.emit('message', message);
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Check if the Optivus server is available
 * 
 * @returns Boolean indicating if the server is available
 */
export async function checkServerAvailability(): Promise<boolean> {
  try {
    await initializeSocket();
    closeConnection();
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Close the Socket.IO connection
 */
export function closeConnection(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
    isConnected = false;
  }
}