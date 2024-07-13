module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'babel-plugin-react-compiler',
      {
        runtimeModule: 'react-compiler-runtime',
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          api: './src/api',
          assets: './src/assets',
          components: './src/components',
          hooks: './src/hooks',
          screens: './src/services',
          screens: './src/screens',
          types: './src/types',
          lib: './src/lib',
        },
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.ios.jsx',
          '.android.jsx',
          '.jsx',
          '.ios.js',
          '.android.js',
          '.js',
          '.json',
          '.svg',
        ],
      },
    ],
    'react-native-reanimated/plugin',
  ],
}
