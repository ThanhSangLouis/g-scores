import type { ScoreBand, SubjectKey } from './score.types.js';

export class Subject {
  constructor(
    public readonly key: SubjectKey,
    public readonly label: string,
    public readonly csvColumn: string,
  ) {}

  getBand(score: number): ScoreBand {
    if (score < 0 || score > 10) {
      throw new Error('Score must be between 0 and 10');
    }

    if (score >= 8) return 'excellent';
    if (score >= 6) return 'good';
    if (score >= 4) return 'average';
    return 'poor';
  }
}
