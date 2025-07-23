/* eslint-disable @typescript-eslint/no-explicit-any  */
"use client";

import { MapContainer, TileLayer, Polygon, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";

import MyLoading from "@/components/MyLoading";
import Geoman from "@/components/Geoman";
import { fetcher } from "@/lib/fetcher";
import { HasilPerengkinganData, IcoordinatesAlternatif } from "@/types";
import { fetchSingleCoordinate } from "@/lib/alternatifKecamatan";
import ScreenshotButton from "./ButtonScreenshot";

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

type MapProps = {
  analysisId: string;
};

const { BaseLayer } = LayersControl;

export default function MappingAlternatif({ analysisId }: MapProps) {
  const { data: rangks, isLoading } = useSWR<HasilPerengkinganData>(
    `/api/hasil-rangking/${analysisId}`,
    fetcher
  );

  const [coordinates, setCoordinates] = useState<IcoordinatesAlternatif[]>([]);
  const [loadingFile, setLoadingFile] = useState(true);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!rangks) return;

    const entries = Object.entries(rangks.dataRangking);
    if (entries.length === 0) return;

    const [kecamatanTertinggi] = entries.sort((a, b) => b[1] - a[1])[0];

    fetchSingleCoordinate(kecamatanTertinggi).then((data) => {
      if (data) {
        setCoordinates([data]);
      }
      setLoadingFile(false);
    });
  }, [rangks]);

  const polygonsMemo = useMemo(() => {
    return coordinates.map((coord) =>
      coord.area.map((point) => [point.lat, point.lng] as [number, number])
    );
  }, [coordinates]);

  // Zoom otomatis ke polygon
  useEffect(() => {
    if (polygonsMemo.length > 0 && mapRef.current) {
      const bounds = L.latLngBounds(polygonsMemo[0]);
      mapRef.current.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [polygonsMemo]);

  if (isLoading || loadingFile) {
    return (
      <div className="relative">
        <MapContainer
          center={[0.336112, 99.906719]}
          zoom={10}
          className="h-[60vh] md:h-[90vh] w-full z-0 brightness-50"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
          <MyLoading />
        </div>
      </div>
    );
  }

  if (!rangks) return <div>Gagal memuat data</div>;

  // Dunia penuh sebagai kotak luar
  const worldBounds: LatLngExpression[] = [
    [-90, -180],
    [-90, 180],
    [90, 180],
    [90, -180],
  ];

  const targetPolygon = polygonsMemo[0];

  return (
    <div className="relative">
      {(() => {
        const rangkPertama = Object.entries(rangks.dataRangking).reduce(
          (acc, [alternatif, nilai]) =>
            nilai > acc.nilai ? { alternatif, nilai } : acc,
          { alternatif: "", nilai: -Infinity }
        );
        return (
          <p className="text-lg font-semibold text-center">
            {rangkPertama.alternatif}
          </p>
        );
      })()}
      <ScreenshotButton targetId="map-id" />

      <MapContainer
        id="map-id"
        ref={mapRef}
        center={[0.336112, 99.906719]}
        zoom={10}
        className="h-[80vh] md:h-[90vh] w-full z-10 relative"
      >
        <LayersControl position="topright">
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              crossOrigin="anonymous"
            />
          </BaseLayer>

          <BaseLayer name="Google Satellite">
            <TileLayer
              url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              crossOrigin="anonymous"
            />
          </BaseLayer>
        </LayersControl>

        {/* Masking luar polygon */}
        {targetPolygon && (
          <Polygon
            positions={[worldBounds, targetPolygon]}
            pathOptions={{
              fillRule: "evenodd",
              color: "black",
              fillColor: "black",
              fillOpacity: 0.7,
              opacity: 0,
            }}
          />
        )}

        {/* Polygon utama */}
        {targetPolygon && (
          <Polygon
            positions={targetPolygon}
            pathOptions={{ color: "white", weight: 1, fillOpacity: 0.4 }}
          />
        )}

        <Geoman />
      </MapContainer>
    </div>
  );
}
