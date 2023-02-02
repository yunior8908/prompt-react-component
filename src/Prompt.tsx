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
        onCancel,
        onOk,
      }: {
        onCancel: () => void;
        onOk: () => void;
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
      const dataPathname = nextPathFromSubscriber
        .split(".")
        .reduce((obj, key) => obj[key], data);

      if (disabledNavigation === true) {
        if (dataPathname !== locationRef.current.currentPath) {
          setShowChildren(true);
        }

        locationRef.current.targetPath = dataPathname;

        setNestedValue(
          data,
          nextPathFromSubscriber as string,
          locationRef.current.currentPath
        );
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
