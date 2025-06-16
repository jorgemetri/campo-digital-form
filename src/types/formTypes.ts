
export interface DataRow {
  N: number;
  UN: string;
  H: number | '';
  FITO: string;
  L: number | '';
  EL: number | '';
}

export interface ParcelData {
  data: DataRow[];
  observations: string;
}

export interface FormData {
  date: string;
  farm: string;
  plot: string;
  parcels: {
    [key: number]: ParcelData;
  };
}

export interface CSVRow {
  Data: string;
  Fazenda: string;
  Talhao: string;
  Parcela: number;
  N: number;
  UN: string;
  'H (cm)': number | '';
  FITO: string;
  L: number | '';
  EL: number | '';
  Observacoes: string;
}
