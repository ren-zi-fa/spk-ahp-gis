import { create } from "zustand";

export type MatrixType = Array<string[]>;
export type AltMatrixes = Array<MatrixType>;

export interface IMatrixStore {
  critMatrix: MatrixType;
  altMatrixes: AltMatrixes;
  setData: (data: { critMatrix: MatrixType; altMatrixes: AltMatrixes }) => void;
}

export const useMatrixStore = create<IMatrixStore>((set) => ({
  critMatrix: [],
  altMatrixes: [],
  loading: false,
  error: null,
  setData: (data: { critMatrix: MatrixType; altMatrixes: AltMatrixes }) => {
    set(data);
  },
}));