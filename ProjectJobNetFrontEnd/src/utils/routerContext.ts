import { createContext, useContext } from 'react';

/**
 * A context to provide router-related utilities without creating nested routers.
 * This is a dummy context for components that may have mistakenly used a Router.
 */
export const RouterContext = createContext(null);

/**
 * Use this instead of creating a new Router in nested components
 */
export const useRouterContext = () => useContext(RouterContext);
