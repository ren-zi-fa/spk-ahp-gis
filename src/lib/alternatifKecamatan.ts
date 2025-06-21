/* eslint-disable @typescript-eslint/no-explicit-any */


import talamau from "../../talamau.json";
import luhakNanduo from "../../luhakNanduo.json";
import gunungTuleh from "../../gunungTuleh.json";
import sasak from "../../sasakRanahPasisia..json";
import kotoBalingka from "../../kotoBalingka.json";
import lembahMelintang from "../../lembahMelintang.json";
import sungaiAur from "../../sungaiAur.json";
import kinali from "../../kinali.json";
import pasaman from "../../pasaman.json";
import sungaiBeremas from "../../sungaiBeremas.json";
import ranahBatahan from "../../ranahBatahan.json";
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

const coordinatesAlternatif: IcoordinatesAlternatif[] = [
  {
    name: "kec.talamau",
    lat: 0.2281496621385,
    lng: 99.93117291449363,
    area: extractLatLngObjects(talamau),
  },
  {
    name: "kec.luhak nan duo",
    lat: 0.040197072612547215,
    lng: 99.79636807623744,
    area: extractLatLngObjects(luhakNanduo),
  },

  {
    name: "kec.gunung tuleh",
    lat: 0.3487002963060624,
    lng: 99.72536513800566,
    area: extractLatLngObjects(gunungTuleh),
  },
  {
    name: "kec.sasak ranah pasisie",
    lat: 0.08245634538989197,
    lng: 99.63235522667532,
    area: extractLatLngObjects(sasak),
  },
  {
    name: "kec.pasaman",
    lat: 0.09710243380053257,
    lng: 99.82464952834991,
    area: extractLatLngObjects(pasaman),
  },
  {
    name: "kec.kinali",
    lat: -0.04812975603011528,
    lng: 99.89173841389854,
    area: extractLatLngObjects(kinali),
  },
  {
    name: "kec.koto balingka",
    lat: 0.31670928112609364,
    lng: 99.49615376044355,
    area: extractLatLngObjects(kotoBalingka),
  },
  {
    name: "kec.sungai aur",
    lat: 0.23574033671726893,
    lng: 99.63813711032093,
    area: extractLatLngObjects(sungaiAur),
  },
  {
    name: "kec.kembah melintang",
    lat: 0.2807049093925458,
    lng: 99.55803078637496,
    area: extractLatLngObjects(lembahMelintang),
  },

  {
    name: "kec.ranah batahan",
    lat: 0.45876222538074557,
    lng: 99.46033837365593,
    area: extractLatLngObjects(ranahBatahan),
  },

  {
    name: "kec.sungai beremas",
    lat: 0.28160072162442235,
    lng: 99.32475062656756,
    area: extractLatLngObjects(sungaiBeremas),
  },
];

export { coordinatesAlternatif };
