/* eslint-disable @typescript-eslint/no-explicit-any */

import { IcoordinatesAlternatif } from "@/types";

function extractLatLngObjects(geojson: any): { lat: number; lng: number }[] {
  const coords: { lat: number; lng: number }[] = [];

  geojson.geometry.coordinates.forEach((polygon: any[][]) => {
    polygon.forEach((ring: any[]) => {
      ring.forEach(([lng, lat]: number[]) => {
        coords.push({ lat, lng });
      });
    });
  });

  return coords;
}

const kecamatanList = [
  {
    name: "kec.talamau",
    lat: 0.2281496621385,
    lng: 99.93117291449363,
    file: "talamau.json",
  },
  {
    name: "kec.luhakNanduo",
    lat: 0.040197072612547215,
    lng: 99.79636807623744,
    file: "luhakNanduo.json",
  },
  {
    name: "kec.gunungTuleh",
    lat: 0.3487002963060624,
    lng: 99.72536513800566,
    file: "gunungTuleh.json",
  },
  {
    name: "kec.sasakRanahPasisia",
    lat: 0.08245634538989197,
    lng: 99.63235522667532,
    file: "sasakRanahPasisia..json",
  },
  {
    name: "kec.pasaman",
    lat: 0.09710243380053257,
    lng: 99.82464952834991,
    file: "pasaman.json",
  },
  {
    name: "kec.kinali",
    lat: -0.04812975603011528,
    lng: 99.89173841389854,
    file: "kinali.json",
  },
  {
    name: "kec.kotoBalingka",
    lat: 0.31670928112609364,
    lng: 99.49615376044355,
    file: "kotoBalingka.json",
  },
  {
    name: "kec.sungaiAur",
    lat: 0.23574033671726893,
    lng: 99.63813711032093,
    file: "sungaiAur.json",
  },
  {
    name: "kec.lembahMelintang",
    lat: 0.2807049093925458,
    lng: 99.55803078637496,
    file: "lembahMelintang.json",
  },
  {
    name: "kec.ranahBatahan",
    lat: 0.45876222538074557,
    lng: 99.46033837365593,
    file: "ranahBatahan.json",
  },
  {
    name: "kec.sungaiBeremas",
    lat: 0.28160072162442235,
    lng: 99.32475062656756,
    file: "sungaiBeremas.json",
  },
];

// Fungsi untuk mengambil semua data kecamatan dari public/data
export async function fetchCoordinatesAlternatif(): Promise<
  IcoordinatesAlternatif[]
> {
  const results: IcoordinatesAlternatif[] = [];

  for (const kec of kecamatanList) {
    const res = await fetch(`/data/${kec.file}`);
    if (!res.ok) throw new Error(`Gagal mengambil ${kec.file}`);
    const geojson = await res.json();
    results.push({
      name: kec.name,
      lat: kec.lat,
      lng: kec.lng,
      area: extractLatLngObjects(geojson),
    });
  }

  return results;
}
export async function fetchSingleCoordinate(
  rawName: string
): Promise<IcoordinatesAlternatif | null> {
  // Hilangkan awalan "kec." dan spasi
  const cleanedName = rawName.replace(/^kec\.\s*/i, "").toLowerCase();

  // Cari data berdasarkan nama file (tanpa ekstensi)
  const kecamatan = kecamatanList.find((kec) =>
    kec.file.toLowerCase().includes(cleanedName)
  );

  if (!kecamatan) {
    console.error("Kecamatan tidak ditemukan dalam daftar:", cleanedName);
    return null;
  }

  try {
    const res = await fetch(`/data/${kecamatan.file}`);
    if (!res.ok) throw new Error("Gagal mengambil file GeoJSON");

    const geojson = await res.json();

    return {
      name: kecamatan.name,
      lat: kecamatan.lat,
      lng: kecamatan.lng,
      area: extractLatLngObjects(geojson),
    };
  } catch (error) {
    console.error("Gagal fetch:", error);
    return null;
  }
}
