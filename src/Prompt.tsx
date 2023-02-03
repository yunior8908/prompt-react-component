import { useState, useRef, useCallback, useEffect } from "react";
import type { ReactNode } from "react";

import { useRouterListening } from "./PromptProvider";

function setNestedValue(obj: any, path: string, value: any) {
  try {
    const keys = path.split(".");
    const lastKey = keys.pop() as string;
    const lastObj = keys.reduce((obj, key) => obj[key], obj);
    lastObj[lastKey] = value;

    return obj;
  } catch (e) {
    return obj;
  }
}

export function Prompt({
  disabledNavigation,
  children,
}: {
  disabledNavigation: Boolean;
  children?:
    | ReactNode
    | (({
        cancelFn,
        acceptFn,
      }: {
        cancelFn: () => void;
        acceptFn: () => void;
      }) => ReactNode);
}) {
  const [showChildren, setShowChildren] = useState(false);

  const { subscriber, nextPathFromSubscriber, onSuccess } =
    useRouterListening();

  const locationRef = useRef<{
    currentPath: string;
    targetPath: string | null;
  }>({
    currentPath: window.location.pathname,
    targetPath: null,
  });

  const unsubscribeRef = useRef(() => {});

  const cancelFn = useCallback(() => {
    setShowChildren(false);
  }, []);

  const acceptFn = useCallback(() => {
    unsubscribeRef.current();

    if (locationRef.current.targetPath) {
      onSuccess(locationRef.current.targetPath);
    }
  }, [onSuccess]);

  useEffect(() => {
    let unsubscribe = () => {};

    unsubscribe = subscriber((data: any) => {
      const dataPathname = nextPathFromSubscriber(data);

      if (disabledNavigation === true) {
        if (dataPathname !== locationRef.current.currentPath) {
          setShowChildren(true);
        }

        locationRef.current.targetPath = dataPathname;

        setNestedValue(data, "", locationRef.current.currentPath);
      }

      return data;
    });

    unsubscribeRef.current = unsubscribe;

    return () => unsubscribe();
  }, [subscriber, disabledNavigation, nextPathFromSubscriber]);

  if (!showChildren) return null;

  return typeof children === "function"
    ? children({ cancelFn, acceptFn })
    : children || null;
}

export function usePrompt(disabledNavigation: boolean) {
  const [canRender, setCanRender] = useState(false);

  const { subscriber, nextPathFromSubscriber, onSuccess } =
    useRouterListening();

  const locationRef = useRef<{
    currentPath: string;
    targetPath: string | null;
  }>({
    currentPath: window.location.pathname,
    targetPath: null,
  });

  const unsubscribeRef = useRef(() => {});

  const cancelFn = useCallback(() => {
    setCanRender(false);
  }, []);

  const acceptFn = useCallback(() => {
    unsubscribeRef.current();

    if (locationRef.current.targetPath) {
      onSuccess(locationRef.current.targetPath);
    }
  }, [onSuccess]);

  useEffect(() => {
    let unsubscribe = () => {};

    unsubscribe = subscriber((data: any) => {
      let pathProperty: string[] = [];

      const proxyValidator = {
        get(target: any, key: string): Function {
          pathProperty.push(key);

          if (typeof target[key] === "object" && target[key] !== null) {
            return new Proxy(target[key], proxyValidator);
          } else {
            return target[key];
          }
        },
      };

      const dataProxy = new Proxy(data, proxyValidator);

      const dataPathname = nextPathFromSubscriber(dataProxy);

      if (disabledNavigation === true) {
        if (dataPathname !== locationRef.current.currentPath) {
          setCanRender(true);
        }

        locationRef.current.targetPath = dataPathname;

        setNestedValue(
          data,
          pathProperty.join("."),
          locationRef.current.currentPath
        );
      }

      return data;
    });

    unsubscribeRef.current = unsubscribe;

    return () => unsubscribe();
  }, [subscriber, disabledNavigation, nextPathFromSubscriber]);

  return { canRender, cancelFn, acceptFn };
}
