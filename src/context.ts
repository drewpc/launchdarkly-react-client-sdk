import { createContext } from 'react';
import { ReactSdkContext } from './types';

/**
 * @ignore
 */
const context = createContext<ReactSdkContext>({ flags: {}, flagKeyMap: {}, ldClient: undefined });
const {
  /**
   * @ignore
   */
  Provider,
  /**
   * @ignore
   */
  Consumer,
} = context;

export { Provider, Consumer, ReactSdkContext };
export default context;
