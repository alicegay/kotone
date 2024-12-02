module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['eslint-plugin-react-compiler'],
  rules: {
    'react-compiler/react-compiler': 'error',
    'react/react-in-jsx-scope': 'off',
    semi: [1, 'never'],
    curly: 0,
    'react-native/no-inline-styles': 0,
  },
}
