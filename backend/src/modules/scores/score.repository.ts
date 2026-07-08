import type { Prisma, PrismaClient } from '@prisma/client';
import type { GroupARankItem, ScoreLevelReportItem, StudentScoreResponse } from './score.types.js';

type ExamScoreRow = NonNullable<Awaited<ReturnType<ScoreRepository['findBySbd']>>>;

function decimalToNumber(value: Prisma.Decimal | null): number | null {
  return value === null ? null : value.toNumber();
}

function requiredDecimalToNumber(value: Prisma.Decimal): number {
  return value.toNumber();
}

export class ScoreRepository {
  constructor(private readonly db: PrismaClient) {}

  findBySbd(sbd: string) {
    return this.db.examScore.findUnique({ where: { sbd } });
  }

  async getTopGroupA(limit: number): Promise<GroupARankItem[]> {
    const rows = await this.db.examScore.findMany({
      where: {
        groupATotal: { not: null },
        toan: { not: null },
        vatLi: { not: null },
        hoaHoc: { not: null },
      },
      orderBy: [{ groupATotal: 'desc' }, { sbd: 'asc' }],
      take: limit,
    });

    return rows.map((row) => ({
      sbd: row.sbd,
      toan: requiredDecimalToNumber(row.toan!),
      vatLi: requiredDecimalToNumber(row.vatLi!),
      hoaHoc: requiredDecimalToNumber(row.hoaHoc!),
      groupATotal: requiredDecimalToNumber(row.groupATotal!),
    }));
  }

  async getScoreLevelReport(): Promise<ScoreLevelReportItem[]> {
    const rows = await this.db.$queryRaw<
      Array<{
        subject: string;
        excellent: bigint;
        good: bigint;
        average: bigint;
        poor: bigint;
      }>
    >`
      SELECT subject,
        COUNT(*) FILTER (WHERE score >= 8) AS excellent,
        COUNT(*) FILTER (WHERE score >= 6 AND score < 8) AS good,
        COUNT(*) FILTER (WHERE score >= 4 AND score < 6) AS average,
        COUNT(*) FILTER (WHERE score < 4) AS poor
      FROM (
        SELECT 'toan' AS subject, toan AS score FROM exam_scores WHERE toan IS NOT NULL
        UNION ALL SELECT 'nguVan', ngu_van FROM exam_scores WHERE ngu_van IS NOT NULL
        UNION ALL SELECT 'ngoaiNgu', ngoai_ngu FROM exam_scores WHERE ngoai_ngu IS NOT NULL
        UNION ALL SELECT 'vatLi', vat_li FROM exam_scores WHERE vat_li IS NOT NULL
        UNION ALL SELECT 'hoaHoc', hoa_hoc FROM exam_scores WHERE hoa_hoc IS NOT NULL
        UNION ALL SELECT 'sinhHoc', sinh_hoc FROM exam_scores WHERE sinh_hoc IS NOT NULL
        UNION ALL SELECT 'lichSu', lich_su FROM exam_scores WHERE lich_su IS NOT NULL
        UNION ALL SELECT 'diaLi', dia_li FROM exam_scores WHERE dia_li IS NOT NULL
        UNION ALL SELECT 'gdcd', gdcd FROM exam_scores WHERE gdcd IS NOT NULL
      ) scores
      GROUP BY subject
    `;

    const labels: Record<string, string> = {
      toan: 'Math',
      nguVan: 'Literature',
      ngoaiNgu: 'Foreign Language',
      vatLi: 'Physics',
      hoaHoc: 'Chemistry',
      sinhHoc: 'Biology',
      lichSu: 'History',
      diaLi: 'Geography',
      gdcd: 'Civic Education',
    };

    return rows.map((row) => ({
      subject: row.subject as ScoreLevelReportItem['subject'],
      label: labels[row.subject] ?? row.subject,
      levels: {
        excellent: Number(row.excellent),
        good: Number(row.good),
        average: Number(row.average),
        poor: Number(row.poor),
      },
    }));
  }

  toStudentScoreResponse(row: ExamScoreRow): StudentScoreResponse {
    return {
      sbd: row.sbd,
      scores: {
        toan: decimalToNumber(row.toan),
        nguVan: decimalToNumber(row.nguVan),
        ngoaiNgu: decimalToNumber(row.ngoaiNgu),
        vatLi: decimalToNumber(row.vatLi),
        hoaHoc: decimalToNumber(row.hoaHoc),
        sinhHoc: decimalToNumber(row.sinhHoc),
        lichSu: decimalToNumber(row.lichSu),
        diaLi: decimalToNumber(row.diaLi),
        gdcd: decimalToNumber(row.gdcd),
      },
      maNgoaiNgu: row.maNgoaiNgu,
      groupATotal: decimalToNumber(row.groupATotal),
    };
  }
}
