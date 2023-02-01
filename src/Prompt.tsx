import * as React from "react";
import { useLocation, useNavigate, Location } from "react-router-dom";

import { useRouterListening } from "./PromptProvider";

export function Prompt({
  disabledNavigation,
  children,
}: {
  disabledNavigation: Boolean;
  children?:
    | React.ReactNode
    | (({
        onCancel,
        onOk,
      }: {
        onCancel: () => void;
        onOk: () => void;
      }) => React.ReactNode);
}) {
  const [showChildren, setShowChildren] = React.useState(false);

  const navigate = useNavigate();

  const listen = useRouterListening();

  const locationRef = React.useRef<{
    currentPath: Location;
    targetPath: Location | null;
  }>({
    currentPath: useLocation(),
    targetPath: null,
  });

  const unsubscribeRef = React.useRef(() => {});

  const onCancel = React.useCallback(() => {
    setShowChildren(false);
  }, []);

  const onOk = React.useCallback(() => {
    unsubscribeRef.current();

    if (locationRef.current.targetPath?.pathname) {
      navigate(locationRef.current.targetPath.pathname);
    }
  }, []);

  React.useEffect(() => {
    let unsubscribe = () => {};

    unsubscribe = listen((data) => {
      if (disabledNavigation === true) {
        if (
          data.location.pathname !== locationRef.current.currentPath.pathname
        ) {
          setShowChildren(true);
        }

        locationRef.current.targetPath = { ...data.location };
        data.location.pathname = locationRef.current.currentPath.pathname;
      }
      return data;
    });

    unsubscribeRef.current = unsubscribe;

    return () => unsubscribe();
  }, [listen, disabledNavigation]);

  if (!showChildren) return null;

  return typeof children === "function"
    ? children({ onCancel, onOk })
    : children || null;
}
