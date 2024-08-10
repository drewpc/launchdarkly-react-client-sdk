import { LDFlagSet } from 'launchdarkly-js-client-sdk';
import React, { useContext } from 'react';
import context, { ReactSdkContext } from './context';

/**
 * `useFlags` is a custom hook which returns all feature flags. It uses the `useContext` primitive
 * to access the LaunchDarkly context set up by `withLDProvider`. As such you will still need to
 * use the `withLDProvider` HOC at the root of your app to initialize the React SDK and populate the
 * context with `ldClient` and your flags.
 *
 * @return All the feature flags configured in your LaunchDarkly project
 */
const useFlags = <T extends LDFlagSet = LDFlagSet>(): T => useFlagsWithContext(context);
export default useFlags;

export const useFlagsWithContext = <T extends LDFlagSet = LDFlagSet>(
  customContext: React.Context<ReactSdkContext>,
): T => {
  const { flags } = useContext<ReactSdkContext>(customContext);

  return flags as T;
};
