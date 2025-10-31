// Web polyfills for React Native modules

// Set up global variables that React Native expects
if (typeof global === 'undefined') {
  (window as any).global = window;
}

// Polyfill for process.env if not available
if (typeof process === 'undefined') {
  (window as any).process = {
    env: {
      NODE_ENV: 'development',
      EXPO_OS: 'web',
    },
  };
}

// Polyfill for __DEV__
if (typeof __DEV__ === 'undefined') {
  (window as any).__DEV__ = true;
}

// Console polyfills for better debugging
if (typeof console.group === 'undefined') {
  console.group = console.log;
  console.groupEnd = () => {};
  console.groupCollapsed = console.log;
}

// Performance polyfill
if (typeof performance === 'undefined') {
  (window as any).performance = {
    now: () => Date.now(),
  };
}

// RequestAnimationFrame polyfill
if (typeof requestAnimationFrame === 'undefined') {
  (window as any).requestAnimationFrame = (callback: FrameRequestCallback) => {
    return setTimeout(callback, 16);
  };
  (window as any).cancelAnimationFrame = (id: number) => {
    clearTimeout(id);
  };
}

export {};
