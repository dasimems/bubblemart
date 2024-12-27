import useAuth from "@/hooks/useAuth";
import React, { useEffect } from "react";

const ApplicationWrapper: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { loadApp } = useAuth();
  useEffect(() => {
    loadApp();
  }, [loadApp]);
  return <>{children}</>;
};

export default ApplicationWrapper;
