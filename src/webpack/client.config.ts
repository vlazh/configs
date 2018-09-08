import webpack, { Configuration, RuleSetRule } from 'webpack';
import webpackMerge from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import appEnv from '../appEnv';
import paths, { dirMap } from '../paths';
import commonConfig from './common.config';
import loaders from './loaders';
import { mergeAndReplaceRules } from './utils';

export const defaultRules: Record<
  'jsRule' | 'cssRule' | 'cssNodeModulesRule' | 'assetsRule',
  RuleSetRule
> = {
  jsRule: {
    test: /\.jsx?$/,
    include: [paths.client.sources, paths.shared.sources],
    use: loaders.babel(),
  },
  cssRule: {
    test: /\.css$/,
    include: [paths.client.sources],
    use: [appEnv.ifDevMode('style-loader', MiniCssExtractPlugin.loader), ...loaders.css()],
  },
  cssNodeModulesRule: {
    test: /\.css$/,
    include: [paths.nodeModules.root],
    use: [
      appEnv.ifDevMode('style-loader', MiniCssExtractPlugin.loader),
      ...loaders.css({ pattern: '[local]', prodPattern: '[local]', postcss: false }),
    ],
  },
  assetsRule: {
    test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|otf)$/,
    include: [paths.client.assets, paths.nodeModules.root],
    use: loaders.assets(),
  },
  // assetsNodeModulesRule: {
  //   test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|otf)$/,
  //   include: [paths.nodeModules.root],
  //   use: loaders.assetsNodeModules(),
  // },
};

export type DefaultClientJsRules = typeof defaultRules;

export interface ConfigOptions extends Pick<Configuration, 'entry'> {
  rules: Record<string, RuleSetRule>;
}

export default ({ entry, rules }: ConfigOptions): Configuration => {
  const moduleRules = mergeAndReplaceRules(defaultRules, rules);

  return webpackMerge(
    commonConfig({
      outputPath: paths.client.output.path,
      outputPublicPath: dirMap.client.output.publicPath,
      hash: true,
    }),
    {
      name: dirMap.client.root,
      target: 'web',

      context: paths.client.sources,

      entry,

      resolve: {
        modules: [paths.client.sources],
        alias: {
          // for universal projects
          shared: paths.shared.sources,
        },
      },

      // recordsOutputPath: path.join(paths.output.path, 'webpack.client.stats.json'),

      module: {
        rules: Object.getOwnPropertyNames(moduleRules).map(name => moduleRules[name] || {}),
      },

      plugins: [
        // To extract a common code to single separate file.
        // Deprecated with webpack 4
        // new webpack.optimize.CommonsChunkPlugin({
        //   name: 'vendor', // Add link to this file in html before other JS/CSS files, it has a common code.
        //   minChunks: ({ context }) => context && context.indexOf(paths.nodeModules.dirname) >= 0, // Only from node_modules.
        // }),
        ...appEnv.ifDevMode(
          [
            // Enable HMR in development.
            new webpack.HotModuleReplacementPlugin(),
          ],
          [
            new MiniCssExtractPlugin({
              filename: `${dirMap.client.output.styles}/[name].css?[contenthash:5]`,
            }),
            // Minificate code in production.
            // new UglifyJsPlugin(), // Deprecated in webpack 4
          ]
        ),
      ],

      devServer: {
        // Static content which not processed by webpack and loadable from disk.
        contentBase: paths.client.staticContent,
        publicPath: dirMap.client.output.publicPath,
        historyApiFallback: true, // For react subpages handling with webpack-dev-server
        host: '0.0.0.0',
        port: 9000,
        hotOnly: true,
        noInfo: false,
        stats: 'minimal',
        // stats: {
        //   colors: true,
        //   errors: true,
        //   warnings: true,
        //   modules: false,
        //   assets: false,
        //   cached: false,
        //   cachedAssets: false,
        // },
      },
    }
  );
};
