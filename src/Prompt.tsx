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
  navigate,
  children,
}: {
  disabledNavigation: Boolean;
  navigate: (path: string) => void;
  children?:
    | ReactNode
    | (({
        onCancel,
        onOk,
      }: {
        onCancel: () => void;
        onOk: () => void;
      }) => ReactNode);
}) {
  const [showChildren, setShowChildren] = useState(false);

  const { routesSubscribe, extractPathname } = useRouterListening();

  const locationRef = useRef<{
    currentPath: string;
    targetPath: string | null;
  }>({
    currentPath: window.location.pathname,
    targetPath: null,
  });

  const unsubscribeRef = useRef(() => {});

  const onCancel = useCallback(() => {
    setShowChildren(false);
  }, []);

  const onOk = useCallback(() => {
    unsubscribeRef.current();

    if (locationRef.current.targetPath) {
      navigate(locationRef.current.targetPath);
    }
  }, []);

  useEffect(() => {
    let unsubscribe = () => {};

    unsubscribe = routesSubscribe((data: any) => {
      const dataPathname = extractPathname
        .split(".")
        .reduce((obj, key) => obj[key], data);

      if (disabledNavigation === true) {
        if (dataPathname !== locationRef.current.currentPath) {
          setShowChildren(true);
        }

        locationRef.current.targetPath = dataPathname;

        setNestedValue(
          data,
          extractPathname as string,
          locationRef.current.currentPath
        );
      }

      return data;
    });

    unsubscribeRef.current = unsubscribe;

    return () => unsubscribe();
  }, [routesSubscribe, disabledNavigation, extractPathname]);

  if (!showChildren) return null;

  return typeof children === "function"
    ? children({ onCancel, onOk })
    : children || null;
}
