import React from "react";

function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="animate-pulse">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square bg-neutral-200 rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-8 bg-neutral-200 rounded"></div>
            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
            <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
            <div className="h-12 bg-neutral-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
