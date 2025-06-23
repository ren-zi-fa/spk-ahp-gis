"use client";

import html2canvas from "html2canvas-pro";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { useState } from "react";

type ScreenshotButtonProps = {
  targetId: string;
  filename?: string;
};

export default function ScreenshotButton({
  targetId,
  filename = "your-data.png",
}: ScreenshotButtonProps) {
  const [isCapturing, setIsCapturing] = useState(false);

  const handleScreenshot = async () => {
    const mapElement = document.getElementById(targetId);
    if (!mapElement) return;

    setIsCapturing(true);

    try {
      await new Promise((res) => setTimeout(res, 10000));

      const canvas = await html2canvas(mapElement, {
        useCORS: true,
      });

      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = filename;
      link.click();
    } catch (err) {
      console.error("Gagal mengambil screenshot:", err);
    }

    setIsCapturing(false);
  };

  return (
    <>
      {isCapturing && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 z-[2000] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-white" />
        </div>
      )}

      <Button
        onClick={handleScreenshot}
        variant="outline"
        className="absolute z-[2100] top-28 right-2"
        disabled={isCapturing}
      >
        {isCapturing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            processing...
          </>
        ) : (
          <>
            <Camera className="mr-2 h-4 w-4" />
            Take Area
          </>
        )}
      </Button>
    </>
  );
}
