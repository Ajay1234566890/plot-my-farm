/// <reference types="vite/client" />
import { ExpoRoot } from 'expo-router';
import { createRoot } from 'react-dom/client';
import { AppRegistry } from 'react-native';

// Import global CSS
import '../global.css';

// Web-specific polyfills
import './polyfills/web-polyfills';

// Register the main component
function App() {
  const ctx = (require as any).context('../app', true, /\.(js|jsx|ts|tsx)$/);
  return <ExpoRoot context={ctx} />;
}

AppRegistry.registerComponent('main', () => App);

// Get the root element
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

// Create root and render
const root = createRoot(container);

// Render the app
AppRegistry.runApplication('main', {
  rootTag: container,
});

// Hot module replacement for development
if (import.meta.hot) {
  import.meta.hot.accept();
}
