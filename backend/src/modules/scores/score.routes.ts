import { Router, type NextFunction, type Request, type Response } from 'express';
import { prisma } from '../../lib/prisma.js';
import { ReportService } from './report.service.js';
import { ScoreController } from './score.controller.js';
import { ScoreRepository } from './score.repository.js';
import { StudentScoreService } from './score.service.js';

export interface ScoreModuleServices {
  studentScoreService: Pick<StudentScoreService, 'findByRegistrationNumber' | 'getTopGroupA'>;
  reportService: Pick<ReportService, 'getScoreLevelReport'>;
}

function asyncHandler(handler: (req: Request, res: Response) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res).catch(next);
  };
}

export function createScoreRouter(services?: ScoreModuleServices) {
  const router = Router();

  const scoreRepository = services ? null : new ScoreRepository(prisma);
  const studentScoreService =
    services?.studentScoreService ?? new StudentScoreService(scoreRepository!);
  const reportService = services?.reportService ?? new ReportService(scoreRepository!);
  const controller = new ScoreController(
    studentScoreService as StudentScoreService,
    reportService as ReportService,
  );

  router.get('/scores/:sbd', asyncHandler(controller.findByRegistrationNumber));
  router.get('/reports/score-levels', asyncHandler(controller.getScoreLevelReport));
  router.get('/top/group-a', asyncHandler(controller.getTopGroupA));

  return router;
}
