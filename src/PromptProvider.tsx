import React, { createContext, useContext, useMemo } from "react";

type ContextValueType = {
  subscriber: (data: any) => () => void;
  nextPathFromSubscriber: (data: any) => string;
  onSuccess: (pathname: string) => void;
};

const RoutesSubscribeContext = createContext<ContextValueType>({
  subscriber: () => () => {},
  nextPathFromSubscriber: () => "",
  onSuccess: () => {},
});

export function useRouterListening() {
  return useContext(RoutesSubscribeContext);
}

export function PromptProvider({
  subscriber,
  nextPathFromSubscriber,
  onSuccess,
  children,
}: ContextValueType & {
  children: React.ReactNode;
}) {
  const value = useMemo(
    () => ({
      subscriber,
      nextPathFromSubscriber,
      onSuccess,
    }),
    [subscriber, nextPathFromSubscriber, onSuccess]
  );

  return (
    <RoutesSubscribeContext.Provider value={value}>
      {children}
    </RoutesSubscribeContext.Provider>
  );
}

PromptProvider.defaultProps = {
  onSuccess: () => {},
};
