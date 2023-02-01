import React, { createContext, useContext, useMemo } from "react";

type ContextValueType = {
  routesSubscribe: (data: any) => () => void;
  extractPathname: string;
};

const RoutesSubscribeContext = createContext<ContextValueType>({
  routesSubscribe: () => () => {},
  extractPathname: "",
});

export function useRouterListening() {
  return useContext(RoutesSubscribeContext);
}

export function PromptProvider({
  routesSubscribe,
  extractPathname,
  children,
}: ContextValueType & {
  children: React.ReactNode;
}) {
  const value = useMemo(
    () => ({ routesSubscribe, extractPathname }),
    [routesSubscribe, extractPathname]
  );

  return (
    <RoutesSubscribeContext.Provider value={value}>
      {children}
    </RoutesSubscribeContext.Provider>
  );
}
