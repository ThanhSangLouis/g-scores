export type ScoreBand = 'excellent' | 'good' | 'average' | 'poor';

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

export type ScoreLevelCounts = Record<ScoreBand, number>;

export interface ScoreLevelReportItem {
  subject: SubjectKey;
  label: string;
  levels: ScoreLevelCounts;
}

export interface StudentScoreResponse {
  sbd: string;
  scores: Record<SubjectKey, number | null>;
  maNgoaiNgu: string | null;
  groupATotal: number | null;
}

export interface GroupARankItem {
  sbd: string;
  toan: number;
  vatLi: number;
  hoaHoc: number;
  groupATotal: number;
}
