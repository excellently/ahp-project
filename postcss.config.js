module.exports = () => ({
  ident: 'postcss',
  plugins: {
    'postcss-import': {},
    cssnano: {},
    autoprefixer: {},
    'postcss-preset-env': {
      stage: 3,
      browsers: ['last 5 versions', '> 5%'],
      features: {
        'custom-media-queries': true,
      },
    },
  },
});
