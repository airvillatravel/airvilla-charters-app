import { getIO } from "../../socket";

// A simple in-memory store for timeouts (use a Map for better control)
const sessionTimeouts = new Map<string, NodeJS.Timeout>();

export const trackSessionExpiration = (userId: string, delay: number) => {
  // Clear any existing timeout for this user
  clearSessionExpiration(userId);

  // Store the timeoutId so it can be cleared later
  const timeoutId = setTimeout(() => {
    const io = getIO();
    io.to(userId).emit("sessionExpiration");
    console.log(`Session expired for user: ${userId}`);
  }, delay);

  // Store the timeout ID
  sessionTimeouts.set(userId, timeoutId);
};

// Utility to cancel session expiration timeout
export const clearSessionExpiration = (userId: string) => {
  if (sessionTimeouts.has(userId)) {
    clearTimeout(sessionTimeouts.get(userId)!);
    sessionTimeouts.delete(userId);
    console.log(`Session timeout cleared for user: ${userId}`);
  }
};
