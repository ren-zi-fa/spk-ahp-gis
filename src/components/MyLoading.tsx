"use client";

import { Loader2 } from "lucide-react";

export default function MyLoading() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
    </div>
  );
}
