import { Button } from "@/components/ui/button";
import domtoimage from "dom-to-image-more";
import React from "react";

type Props = {
  targetId: string;
};

const ScreenshotButton = ({ targetId }: Props) => {
  const handleScreenshot = async () => {
    const mapElement = document.getElementById(targetId);
    if (!mapElement) return;

    // Sembunyikan titik edit saja
    const editHandles = mapElement.querySelectorAll(
      ".leaflet-pm-marker, .marker-icon, [class*='vertex']"
    );

    editHandles.forEach((el) => {
      (el as HTMLElement).style.display = "none";
    });

    // Ambil gambar sebagai blob
    const blob = await domtoimage.toBlob(mapElement);

    // Kembalikan titik edit
    editHandles.forEach((el) => {
      (el as HTMLElement).style.display = "";
    });

    // Buat link dan download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "map-result.png";
    link.click();
  };

  return (
    <div className="text-center my-4">
      <Button
        onClick={handleScreenshot}
        className="absolute z-40 top-28 right-2"
        variant="outline"
      >
        Take area
      </Button>
    </div>
  );
};

export default ScreenshotButton;
