import { createContext } from 'react';
import { ReactSdkContext } from './types';

const reactSdkContextFactory = () => createContext<ReactSdkContext>({ flags: {}, flagKeyMap: {}, ldClient: undefined });
/**
 * @ignore
 */
const context = reactSdkContextFactory();
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

export { Provider, Consumer, ReactSdkContext, reactSdkContextFactory };
export default context;
