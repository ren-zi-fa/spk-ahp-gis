"use client";
import { useEffect } from "react";
import { useLeafletContext } from "@react-leaflet/core";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

const Geoman = () => {
  const context = useLeafletContext();

  useEffect(() => {
    const leafletContainer = context.layerContainer || context.map;

    (leafletContainer as any).pm.addControls({
      drawMarker: false,
    });

    (leafletContainer as any).pm.setGlobalOptions({ pmIgnore: false });

    (leafletContainer as any).on("pm:create", (e: any) => {
      if (e.layer && e.layer.pm) {
        const shape = e;
        console.log(e);

        // enable editing of circle
        shape.layer.pm.enable();

        console.log(`object created: ${shape.layer.pm.getShape()}`);
        // console.log(leafletContainer.pm.getGeomanLayers(true).toGeoJSON());
        (leafletContainer as any).pm
          .getGeomanLayers(true)
          .bindPopup("i am whole")
          .openPopup();
        (leafletContainer as any).pm
          .getGeomanLayers()
          .map((layer: any, index: any) =>
            layer.bindPopup(`I am figure N° ${index}`)
          );
        shape.layer.on("pm:edit", (e: any) => {
          const event = e;
          // console.log(leafletContainer.pm.getGeomanLayers(true).toGeoJSON());
        });
      }
    });

    (leafletContainer as any).on("pm:remove", (e: any) => {
      console.log("object removed");
      // console.log( (leafletContainer as any).pm.getGeomanLayers(true).toGeoJSON());
    });

    return () => {
      (leafletContainer as any).pm.removeControls();
      (leafletContainer as any).pm.setGlobalOptions({ pmIgnore: true });
    };
  }, [context]);

  return null;
};

export default Geoman;
