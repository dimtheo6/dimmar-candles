import React from "react";

function Loading({text}: {text?: string}) {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-neutral-600">{text || "Loading..."}</p>
      </div>
    </div>
  );
}

export default Loading;