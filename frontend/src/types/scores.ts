export type SubjectKey =
  | 'toan'
  | 'nguVan'
  | 'ngoaiNgu'
  | 'vatLi'
  | 'hoaHoc'
  | 'sinhHoc'
  | 'lichSu'
  | 'diaLi'
  | 'gdcd';

export type ScoreBand = 'excellent' | 'good' | 'average' | 'poor';

export interface StudentScore {
  sbd: string;
  scores: Record<SubjectKey, number | null>;
  maNgoaiNgu: string | null;
  groupATotal: number | null;
}

export interface ScoreLevelReport {
  subject: SubjectKey;
  label: string;
  levels: Record<ScoreBand, number>;
}

export interface GroupARank {
  sbd: string;
  toan: number;
  vatLi: number;
  hoaHoc: number;
  groupATotal: number;
}
