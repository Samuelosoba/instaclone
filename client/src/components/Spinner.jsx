import React from "react";

export default function Spinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-lg bg-secondary"></span>
    </div>
  );
}
