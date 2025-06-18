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

import React, { useMemo } from "react";

import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

import { pasamanBaratBoundary } from "@/lib/koordinat";
import Geoman from "./Geoman";

// Fix for marker icons not showing correctly

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
export default function Map({ coordinates }: MapProps) {
  const addAlternatif = async ({ lang, lat, name }: AlternatifInput) => {
    try {
      const id = uuidv4();
      const result = await fetch("/api/alternatif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, lang, lat }),
      });

      const data = await result.json();

      if (!result.ok) {
        throw new Error(data.message || "Terjadi kesalahan");
      }

      toast.success("berhasil menambahkan data");
    } catch (error: any) {
      toast.error("data sudah di tambahkan", error);
    }
  };

  return (
    <MapContainer
      center={[0.336112, 99.906719]}
      zoom={9}
      className="h-[90vh] w-[100%] z-10"
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

        {/* Overlay Layers */}
        <Overlay checked name="Batas Kabupaten Pasaman Barat">
          <Polygon
            positions={pasamanBaratBoundaryReversed}
            pathOptions={{ color: "blue", weight: 1, fillOpacity: 0 }}
          />
        </Overlay>

        {coordinates.map((coord, index) => {
          const polygonPositions = useMemo(
            () =>
              coord.area.map(
                (point) => [point.lat, point.lng] as [number, number]
              ),
            [coord.area]
          );

          return (
            <Polygon
              key={index}
              positions={polygonPositions}
              pathOptions={{ color: "red", weight: 1, fillOpacity: 0.4 }}
            />
          );
        })}

        {coordinates.map((coord, index) => (
          <Marker key={index} position={[coord.lat, coord.lng]}>
            <Popup>
              <div
                className="cursor-pointer select-none"
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
              </div>
            </Popup>
          </Marker>
        ))}
      </LayersControl>
      <Geoman />
    </MapContainer>
  );
}
