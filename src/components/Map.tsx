"use client";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Polygon,
  LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { pasamanBaratBoundary } from "@/lib/koordinat";
import Geoman from "./Geoman";
import { mutate } from "swr";
import MyLoading from "./MyLoading";

const markerIcon = "/marker-icon.png";
const markerIcon2x = "/marker-icon-2x.png";
const markerShadow = "/marker-shadow.png";
/* eslint-disable */
// @ts-expect-error
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});
/* eslint-disable */
type Coordinates = {
  lat: number;
  lng: number;
  name: string;
  area: { lat: number; lng: number }[];
};

type MapProps = {
  coordinates: Coordinates[];
  analysisId: string;
};

const pasamanBaratBoundaryReversed: L.LatLngTuple[] = pasamanBaratBoundary.map(
  ([lng, lat]) => [lat, lng]
);
const { BaseLayer, Overlay } = LayersControl;
type AlternatifInput = {
  name: string;
  lang: number;
  lat: number;
};
export default function Map({ coordinates, analysisId }: MapProps) {
  const [isLoading, setIsLoading] = useState(false);

  const addAlternatif = async ({ lang, lat, name }: AlternatifInput) => {
    try {
      setIsLoading(true);
      const result = await fetch("/api/alternatif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId,
          alternatif: [{ name, lat, lang }],
        }),
      });

      const res = await result.json();
      if (result.ok) {
        mutate("/api/alternatif");
        alert(res.message);
      } else {
        alert(res.error || "Terjadi kesalahan");
      }
    } catch (error: any) {
      toast.error("Gagal terhubung ke server");
      console.error("Network error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const polygonsMemo = useMemo(() => {
    return coordinates.map((coord) =>
      coord.area.map((point) => [point.lat, point.lng] as [number, number])
    );
  }, [coordinates]);

  return (
    <div className="relative w-full h-full">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-[1000] bg-black/40 flex items-center justify-center">
          <MyLoading />
        </div>
      )}
      <MapContainer
        center={[0.336112, 99.906719]}
        zoom={9}
        className="h-[60vh] md:h-[90vh] w-full z-10"
      >
        <LayersControl position="topright">
          {/* Base Layers */}
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>
          <BaseLayer name="Google Satellite">
            <TileLayer url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" />
          </BaseLayer>

          {/* Overlay untuk Batas Kabupaten */}
          <Overlay checked name="Batas Kabupaten Pasaman Barat">
            <Polygon
              positions={pasamanBaratBoundaryReversed}
              pathOptions={{ color: "blue", weight: 1, fillOpacity: 0 }}
            />
          </Overlay>

          {/* Polygon Alternatif */}
          {polygonsMemo.map((polygonPositions, index) => (
            <Polygon
              key={`polygon-${index}`}
              positions={polygonPositions}
              pathOptions={{ color: "red", weight: 1, fillOpacity: 0.4 }}
            />
          ))}

          {/* Marker Alternatif */}
          {coordinates.map((coord, index) => (
            <Marker key={`marker-${index}`} position={[coord.lat, coord.lng]}>
              <Popup>
                <div
                  className="cursor-pointer select-none p-2 block rounded"
                  id={coord.name}
                  onDoubleClick={() =>
                    addAlternatif({
                      name: coord.name,
                      lat: coord.lat,
                      lang: coord.lng,
                    })
                  }
                >
                  {coord.name} <br />
                  <span className="text-xs bg-white text-white hover:text-black">
                    Double click to add
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
        </LayersControl>
        <Geoman />
      </MapContainer>
    </div>
  );
}
