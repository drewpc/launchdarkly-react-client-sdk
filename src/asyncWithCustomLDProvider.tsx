import React, { useState, useEffect, ReactNode } from 'react';
import { LDFlagChangeset, LDClient } from 'launchdarkly-js-client-sdk';
import { AsyncProviderConfig, defaultReactOptions } from './types';
import { ReactSdkContext } from './context';
import { fetchFlags, getContextOrUser, getFlattenedFlagsFromChangeset } from './utils';
import getFlagsProxy from './getFlagsProxy';
import ProviderState from './providerState';

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
 * @param config - The configuration that was used to initialize LaunchDarkly's JS SDK
 * @param ldClient - The client instance that was initialized LaunchDarkly's JS SDK
 * @param reactContext - The context should be used to for Providers/Consumers
 */
export default async function asyncWithCustomLDProvider(
  config: AsyncProviderConfig,
  ldClient: LDClient,
  reactContext: React.Context<ReactSdkContext>,
) {
  const { flags: targetFlags, options, reactOptions: userReactOptions } = config;
  const reactOptions = { ...defaultReactOptions, ...userReactOptions };
  const context = getContextOrUser(config) ?? { anonymous: true, kind: 'user' };
  let error: Error;
  let fetchedFlags = {};

  try {
    await ldClient.waitForInitialization(config.timeout);
    fetchedFlags = fetchFlags(ldClient, targetFlags);
  } catch (e) {
    error = e as Error;
  }

  const initialFlags = options?.bootstrap && options.bootstrap !== 'localStorage' ? options.bootstrap : fetchedFlags;

  const { Provider } = reactContext;

  const LDProvider = ({ children }: { children: ReactNode }) => {
    const [ldData, setLDData] = useState<ProviderState>(() => ({
      unproxiedFlags: initialFlags,
      ...getFlagsProxy(ldClient, initialFlags, reactOptions, targetFlags),
      ldClient,
      error,
    }));

    useEffect(() => {
      function onChange(changes: LDFlagChangeset) {
        const updates = getFlattenedFlagsFromChangeset(changes, targetFlags);
        if (Object.keys(updates).length > 0) {
          setLDData((prevState) => {
            const updatedUnproxiedFlags = { ...prevState.unproxiedFlags, ...updates };

            return {
              ...prevState,
              unproxiedFlags: updatedUnproxiedFlags,
              ...getFlagsProxy(ldClient, updatedUnproxiedFlags, reactOptions, targetFlags),
            };
          });
        }
      }
      ldClient.on('change', onChange);

      function onReady() {
        const unproxiedFlags = fetchFlags(ldClient, targetFlags);
        setLDData((prevState) => ({
          ...prevState,
          unproxiedFlags,
          ...getFlagsProxy(ldClient, unproxiedFlags, reactOptions, targetFlags),
        }));
      }

      function onFailed(e: Error) {
        setLDData((prevState) => ({ ...prevState, error: e }));
      }

      // Only subscribe to ready and failed if waitForInitialization timed out
      // because we want the introduction of init timeout to be as minimal and backwards
      // compatible as possible.
      if (error?.name.toLowerCase().includes('timeout')) {
        ldClient.on('failed', onFailed);
        ldClient.on('ready', onReady);
      }

      return function cleanup() {
        ldClient.off('change', onChange);
        ldClient.off('failed', onFailed);
        ldClient.off('ready', onReady);
      };
    }, []);

    // unproxiedFlags is for internal use only. Exclude it from context.
    const { unproxiedFlags: _, ...rest } = ldData;

    return <Provider value={rest}>{children}</Provider>;
  };

  return LDProvider;
}
