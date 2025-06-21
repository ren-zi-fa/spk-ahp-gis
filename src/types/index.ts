export interface IcoordinatesAlternatif {
  lat: number;
  lng: number;
  name: string;
  area: { lat: number; lng: number }[];
}
export interface ICriteriaRes {
  sumCrit: number[] | number[][];
  normalizedMatrix: number[][];
  CI: number;
  CR: number;
  RI: number;
  originalMatrix: number[][];
  konsistensi: string;
  lambdaMax: number;
  n: number;
  weightsCriteria: number[];
}

export interface CR {
  CR: number;
  isConsistent: boolean;
}
export interface IAlternatifRes {
  sumAlt: number[][];
  originalMatrix: number[][][];
  normalizedMatrix: number[][][];
  CI: number[];
  CR: CR[];
  RI: number;
  konsistensi: boolean[];
  lambdaMax: number[];
  n: number[];
  weightAlt: number[][];
}

export type Kriteria = {
  id: string;
  name: string;
  createdAt: string;
  analysisId: string;
  analysis: {
    name: string;
  };
};

export type Analysis = {
  id: string;
  name: string;
  createdAt: string;
};
export type Alternatif = {
  id: string;
  name: string;
  lat: number;
  lang: number;
  createdAt: string;
  analysisId: string;
  analysis: {
    name: string;
  };
};

export type ApiResponse = {
  kriteria: Kriteria[];
  alternatif: Alternatif[];
};

export type MatrixFormData = {
  critMatrix: string[][];
  altMatrixes: string[][][];
};

export interface HasilPerengkinganData {
  id: string;
  dataRangking: Record<string, number>;
  createdAt: string;  
  analysisId: string;
}