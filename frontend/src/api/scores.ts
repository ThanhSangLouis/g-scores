import { apiGet } from './client';
import type { GroupARank, ScoreLevelReport, StudentScore } from '../types/scores';

export function getScoreBySbd(sbd: string) {
  return apiGet<StudentScore>(`/api/scores/${sbd}`);
}

export function getScoreLevelsReport() {
  return apiGet<ScoreLevelReport[]>('/api/reports/score-levels');
}

export function getTopGroupA(limit = 10) {
  return apiGet<GroupARank[]>(`/api/top/group-a?limit=${limit}`);
}
