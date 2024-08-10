import React, { useContext } from 'react';
import context, { ReactSdkContext } from './context';

// tslint:disable:max-line-length
/**
 * `useLDClient` is a custom hook which returns the underlying [LaunchDarkly JavaScript SDK client object](https://launchdarkly.github.io/js-client-sdk/interfaces/LDClient.html).
 * Like the `useFlags` custom hook, `useLDClient` also uses the `useContext` primitive to access the LaunchDarkly
 * context set up by `withLDProvider`. You will still need to use the `withLDProvider` HOC
 * to initialise the react sdk to use this custom hook.
 *
 * @return The `launchdarkly-js-client-sdk` `LDClient` object
 */
// tslint:enable:max-line-length
const useLDClient = () => useLDClientWithContext(context);
export default useLDClient;

export const useLDClientWithContext = (customContext: React.Context<ReactSdkContext>) => {
  const { ldClient } = useContext(context);

  return ldClient;
};
