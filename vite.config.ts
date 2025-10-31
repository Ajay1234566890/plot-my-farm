import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react({
      babel: {
        presets: [
          ['babel-preset-expo', { web: { useTransformReactJSXExperimental: true } }]
        ],
        plugins: [
          [
            'module-resolver',
            {
              root: ['./'],
              alias: {
                '@': './',
                'tailwind.config': './tailwind.config.js',
              },
            },
          ],
        ],
      },
    }),
  ],
  define: {
    global: 'globalThis',
    __DEV__: JSON.stringify(true),
    'process.env.NODE_ENV': JSON.stringify('development'),
    'process.env.EXPO_OS': JSON.stringify('web'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      'react-native': 'react-native-web',
      'react-native-linear-gradient': 'react-native-web-linear-gradient',
      'react-native-svg': 'react-native-svg/lib/commonjs/ReactNativeSVG.web',
      'expo-linear-gradient': 'react-native-web-linear-gradient',
      'expo-blur': path.resolve(__dirname, './web/polyfills/expo-blur.web.ts'),
      'expo-haptics': path.resolve(__dirname, './web/polyfills/expo-haptics.web.ts'),
      'expo-image': path.resolve(__dirname, './web/polyfills/expo-image.web.tsx'),
      '@gorhom/bottom-sheet': path.resolve(__dirname, './web/polyfills/bottom-sheet.web.tsx'),
    },
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-native-web',
      'expo-router',
      '@react-navigation/native',
      '@react-navigation/bottom-tabs',
      'react-native-reanimated',
      'react-native-gesture-handler',
      'react-native-safe-area-context',
      'react-native-screens',
    ],
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  css: {
    postcss: './postcss.config.js',
  },
});
