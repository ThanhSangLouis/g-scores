import { HttpError } from '../../lib/http-error.js';
import type { ScoreRepository } from './score.repository.js';

export class StudentScoreService {
  constructor(private readonly scoreRepository: ScoreRepository) {}

  async findByRegistrationNumber(sbd: string) {
    if (!/^\d{8}$/.test(sbd)) {
      throw new HttpError(400, 'Registration number must be exactly 8 digits');
    }

    const row = await this.scoreRepository.findBySbd(sbd);
    return row ? this.scoreRepository.toStudentScoreResponse(row) : null;
  }

  async getTopGroupA(limit: number) {
    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
      throw new HttpError(400, 'Limit must be an integer from 1 to 50');
    }

    return this.scoreRepository.getTopGroupA(limit);
  }
}
