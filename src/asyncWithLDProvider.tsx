import { initialize } from 'launchdarkly-js-client-sdk';
import { AsyncProviderConfig } from './types';
import reactContext from './context';
import { getContextOrUser } from './utils';
import wrapperOptions from './wrapperOptions';
import asyncWithCustomLDProvider from './asyncWithCustomLDProvider';

/**
 * This is an async function which initializes LaunchDarkly's JS SDK (`launchdarkly-js-client-sdk`)
 * and awaits it so all flags and the ldClient are ready before the consumer app is rendered.
 *
 * The difference between `withLDProvider` and `asyncWithLDProvider` is that `withLDProvider` initializes
 * `launchdarkly-js-client-sdk` at componentDidMount. This means your flags and the ldClient are only available after
 * your app has mounted. This can result in a flicker due to flag changes at startup time.
 *
 * `asyncWithLDProvider` initializes `launchdarkly-js-client-sdk` at the entry point of your app prior to render.
 * This means that your flags and the ldClient are ready at the beginning of your app. This ensures your app does not
 * flicker due to flag changes at startup time.
 *
 * `asyncWithLDProvider` accepts a config object which is used to initialize `launchdarkly-js-client-sdk`.
 *
 * `asyncWithLDProvider` does not support the `deferInitialization` config option because `asyncWithLDProvider` needs
 * to be initialized at the entry point prior to render to ensure your flags and the ldClient are ready at the beginning
 * of your app.
 *
 * It returns a provider which is a React FunctionComponent which:
 * - saves all flags and the ldClient instance in the context API
 * - subscribes to flag changes and propagate them through the context API
 *
 * @param config - The configuration used to initialize LaunchDarkly's JS SDK
 */
export default async function asyncWithLDProvider(config: AsyncProviderConfig) {
  const { clientSideID, options } = config;
  const context = getContextOrUser(config) ?? { anonymous: true, kind: 'user' };

  const ldClient = initialize(clientSideID, context, { ...wrapperOptions, ...options });

  return asyncWithCustomLDProvider(config, ldClient, reactContext);
}
