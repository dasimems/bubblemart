import useAuth from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";

const ApplicationWrapper: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { loadApp } = useAuth();
  const [hasLoadedApp, setHasLoadedApp] = useState(false);
  useEffect(() => {
    if (!hasLoadedApp) {
      loadApp();
      setHasLoadedApp(true);
    }
  }, [loadApp, hasLoadedApp]);
  return <>{children}</>;
};

export default ApplicationWrapper;
