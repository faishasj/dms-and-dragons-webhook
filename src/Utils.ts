// App Wide Utilities

export const wait = (duration = 1000): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, duration));