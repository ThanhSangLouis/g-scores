import type { ScoreRepository } from './score.repository.js';

export class ReportService {
  constructor(private readonly scoreRepository: ScoreRepository) {}

  getScoreLevelReport() {
    return this.scoreRepository.getScoreLevelReport();
  }
}
