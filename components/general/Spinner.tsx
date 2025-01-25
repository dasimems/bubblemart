import React from "react";

const Spinner: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={`border-4 border-primary size-10 rounded-full border-l-transparent border-b-transparent animate-spin ${className}`}
    />
  );
};

export default Spinner;
