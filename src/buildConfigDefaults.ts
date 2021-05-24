/* eslint-disable @typescript-eslint/explicit-function-return-type */

export function getClientConfig(root = 'client') {
  return {
    root,
    sources: 'src',
    assets: 'src/assets',
    staticContent: ['public'],

    /** Generating html options */
    html: {
      /** For example: `assets/index.html` */
      template: '',
      filename: 'index.html',
      title: '',
    } as import('html-webpack-plugin').Options,

    /** Used by eslint webpack resolver */
    webpackConfig: '',
    /** Used by webpack loaders and plugins */
    tsconfig: 'tsconfig.json',
    /** Plug'n'Play resolver for Webpack */
    webpackPnpEnabled: false,

    output: {
      root,
      js: 'js',
      styles: 'styles',
      assets: 'assets',
      external: 'lib',
      publicPath: '/',

      /** Generated asset manifest */
      assetManifest: {
        /** For example: `asset-manifest.json` */
        fileName: '',
        filterTemplate: {},
      },

      /** Generating service worker options (workbox-webpack-plugin) */
      sw: {
        /** For example: `service-worker.js` */
        swDest: '',
      },
    },
  };
}

export function getServerConfig(root = 'server') {
  return {
    root,
    sources: 'src',

    /** Used by eslint webpack resolver */
    webpackConfig: '',
    /** Used by webpack loaders and plugins */
    tsconfig: 'tsconfig.json',

    output: {
      root,
      publicPath: '/',
    },
  };
}

export function getSharedConfig(root = 'shared') {
  return {
    root,
    sources: 'src',
    tsconfig: 'tsconfig.json',
  };
}

export type BuildConfigDefaults = {
  output: {
    root: string;
  };

  client: ReturnType<typeof getClientConfig>;
  server: ReturnType<typeof getServerConfig>;
  shared: ReturnType<typeof getSharedConfig>;
};

const buildConfigDefaults: BuildConfigDefaults = {
  output: {
    root: 'dist',
  },

  client: getClientConfig(),
  server: getServerConfig(),
  shared: getSharedConfig(),
};

export default Object.freeze(buildConfigDefaults);
