import { DefinePlugin } from 'webpack'
import type * as Config from 'webpack-chain'
import type { App } from '@vuepress/core'

/**
 * Set webpack plugins
 */
export const handlePlugins = ({
  app,
  config,
  isServer,
}: {
  app: App
  config: Config
  isServer: boolean
}): void => {
  // define plugin
  config.plugin('define').use(DefinePlugin, [
    {
      'process.env.NODE_ENV': JSON.stringify(app.env.nodeEnv),
      '__VERSION__': JSON.stringify(app.version),
      '__DEV__': JSON.stringify(app.env.isDev),
      '__SSR__': JSON.stringify(isServer),
      // disable options API by default
      // @see http://link.vuejs.org/feature-flags
      '__VUE_OPTIONS_API__': JSON.stringify(false),
      '__VUE_PROD_DEVTOOLS__': JSON.stringify(false),
    },
  ])

  // plugin hook: define
  const defineResult = app.pluginApi.hooks.define.processSync()

  // tap the arguments of DefinePlugin
  config.plugin('define').tap(([options]) => {
    defineResult.forEach((defineObject) =>
      Object.entries(defineObject).forEach(([key, value]) => {
        options[key] = JSON.stringify(value)
      })
    )

    return [options]
  })
}
