import webpack, { Configuration } from 'webpack';
import webpackMerge from 'webpack-merge';
import appEnv from '../appEnv';
import paths from '../paths';
import serverConfig, { ConfigOptions } from './server.config';
import { defaultRules as jsDefaultRules, DefaultClientJsRules } from './client.config';
import loaders from './loaders';
import { mergeAndReplaceRules } from './utils';

export const defaultRules: DefaultClientJsRules = {
  jsRule: {
    ...jsDefaultRules.jsRule,
    include: [...(jsDefaultRules.jsRule.include as any), paths.server.sources],
  },
  cssRule: {
    ...jsDefaultRules.cssRule,
    // process css in server side always in ssr mode
    use: loaders.css({ ssr: true }),
  },
  cssNodeModulesRule: {
    ...jsDefaultRules.cssNodeModulesRule,
    // process css in server side always in ssr mode
    use: loaders.cssNodeModules({ ssr: true }),
  },
  assetsRule: {
    ...jsDefaultRules.assetsRule,
    use: loaders.assets({ ssr: true }),
  },
};

export default ({ entry, rules, nodeExternalsOptions }: ConfigOptions): Configuration => {
  const moduleRules = mergeAndReplaceRules(defaultRules, rules);

  return webpackMerge(serverConfig({ entry, rules: moduleRules, nodeExternalsOptions }), {
    name: 'universal',
    context: paths.root,

    resolve: {
      modules: [paths.client.sources],
      alias: {
        server: paths.server.sources,
        shared: paths.shared.sources,
        client: paths.client.sources,
      },
    },

    plugins: [
      // Don't watch on client files when ssr is turned off because client by self make hot update
      // and server not needs in updated files because server not render react components.
      ...(appEnv.ssr ? [] : [new webpack.WatchIgnorePlugin([paths.client.root])]),
    ],
  });
};