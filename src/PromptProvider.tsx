import * as React from "react";
import { createBrowserRouter } from "react-router-dom";

const defaultRoutesConfig = createBrowserRouter([{}]);

const routerListeningContext = React.createContext(
  defaultRoutesConfig.subscribe
);

export function useRouterListening() {
  return React.useContext(routerListeningContext);
}

export function PromptProvider({
  value,
  children,
}: {
  value: typeof defaultRoutesConfig.subscribe;
  children: React.ReactNode;
}) {
  return (
    <routerListeningContext.Provider value={value}>
      {children}
    </routerListeningContext.Provider>
  );
}
