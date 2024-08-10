import React, { useContext } from 'react';
import context, { ReactSdkContext } from './context';

/**
 * Provides the LaunchDarkly client initialization error, if there was one.
 *
 * @return The `launchdarkly-js-client-sdk` `LDClient` initialization error
 */
export default function useLDClientError() {
  return useLDClientErrorWithContext(context);
}

export function useLDClientErrorWithContext(customContext: React.Context<ReactSdkContext>) {
  const { error } = useContext(customContext);

  return error;
}
