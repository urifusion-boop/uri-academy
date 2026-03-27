export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    const msg = err.message;
    if (msg.includes('401')) return 'Invalid email or password';
    if (msg.includes('403')) return "You don't have permission to do this";
    if (msg.includes('404')) return 'The requested resource was not found';
    if (msg.includes('400')) return 'Please check your input and try again';
    if (msg.includes('500')) return 'Something went wrong on our end. Please try again later.';
    if (msg.includes('502') || msg.includes('503')) return 'Service is temporarily unavailable. Please try again later.';
    if (msg.includes('NetworkError') || msg.includes('Failed to fetch') || msg.includes('ECONNREFUSED')) return 'Unable to connect. Please check your internet connection.';
    return msg;
  }
  return 'An unexpected error occurred. Please try again.';
}
