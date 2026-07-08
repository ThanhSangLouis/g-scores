import type { Request, Response } from 'express';
import { HttpError } from '../../lib/http-error.js';
import type { ReportService } from './report.service.js';
import type { StudentScoreService } from './score.service.js';

export class ScoreController {
  constructor(
    private readonly studentScoreService: StudentScoreService,
    private readonly reportService: ReportService,
  ) {}

  findByRegistrationNumber = async (req: Request, res: Response) => {
    const sbd = String(req.params.sbd);

    if (!/^\d{8}$/.test(sbd)) {
      throw new HttpError(400, 'Registration number must be exactly 8 digits');
    }

    const student = await this.studentScoreService.findByRegistrationNumber(sbd);

    if (!student) {
      throw new HttpError(404, 'Score not found');
    }

    res.json(student);
  };

  getScoreLevelReport = async (_req: Request, res: Response) => {
    res.json(await this.reportService.getScoreLevelReport());
  };

  getTopGroupA = async (req: Request, res: Response) => {
    const rawLimit = req.query.limit ?? '10';
    const limit = Number(rawLimit);

    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
      throw new HttpError(400, 'Limit must be an integer from 1 to 50');
    }

    res.json(await this.studentScoreService.getTopGroupA(limit));
  };
}
