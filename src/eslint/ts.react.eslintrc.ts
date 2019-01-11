import { moduleExtensions } from '../paths';

module.exports = {
  extends: [require.resolve('./react.eslintrc.js'), require.resolve('./ts.common.eslintrc.js')],

  rules: {
    'react/jsx-filename-extension': [
      'error',
      { extensions: moduleExtensions.filter(ext => ext.includes('js') || ext.includes('ts')) },
    ],
    'react/jsx-wrap-multilines': 'off',
  },
};
