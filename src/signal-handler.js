// Signal handling and cancellation management
let isCancelled = false;

// Handle Ctrl+C (SIGINT)
process.on("SIGINT", () => {
  console.log("\nABORTED!");
  process.exit(0);
});

// Handle termination signal (SIGTERM)
process.on("SIGTERM", () => {
  console.log("\nABORTED!");
  process.exit(0);
});

// Export functions to check cancellation state
export function checkCancellation() {
  if (isCancelled) {
    return true;
  }
  return false;
}

export function getCancellationState() {
  return isCancelled;
}

export function setCancelled() {
  isCancelled = true;
}

// Force exit function for when we need to exit immediately
export function forceExit() {
  console.log("\nABORTED!");
  process.exit(0);
}
