import { createReadStream } from 'node:fs';
import { parse } from 'csv-parse';
import type { Prisma, PrismaClient } from '@prisma/client';

interface CsvScoreRow {
  sbd: string;
  toan: string;
  ngu_van: string;
  ngoai_ngu: string;
  vat_li: string;
  hoa_hoc: string;
  sinh_hoc: string;
  lich_su: string;
  dia_li: string;
  gdcd: string;
  ma_ngoai_ngu: string;
}

export interface ImportScoresOptions {
  filePath: string;
  batchSize: number;
  reset: boolean;
  limit?: number;
}

export interface ImportScoresResult {
  imported: number;
  skipped: number;
}

function emptyToNull(value: string): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function scoreToNumber(value: string): number | null {
  const normalized = emptyToNull(value);
  if (normalized === null) return null;

  const score = Number(normalized);
  if (!Number.isFinite(score) || score < 0 || score > 10) {
    throw new Error(`Invalid score value "${value}"`);
  }

  return score;
}

function decimalInput(value: number | null): Prisma.Decimal | string | null {
  return value === null ? null : value.toFixed(2);
}

function computeGroupATotal(toan: number | null, vatLi: number | null, hoaHoc: number | null) {
  if (toan === null || vatLi === null || hoaHoc === null) return null;
  return toan + vatLi + hoaHoc;
}

export class ScoreImportService {
  constructor(private readonly db: PrismaClient) {}

  async importFromCsv(options: ImportScoresOptions): Promise<ImportScoresResult> {
    if (options.reset) {
      await this.db.examScore.deleteMany();
    }

    const parser = createReadStream(options.filePath).pipe(
      parse({
        columns: true,
        bom: true,
        skip_empty_lines: true,
        trim: true,
      }),
    );

    let imported = 0;
    let skipped = 0;
    const batch: Prisma.ExamScoreCreateManyInput[] = [];

    const flush = async () => {
      if (batch.length === 0) return;

      const attempted = batch.length;
      const result = await this.db.examScore.createMany({
        data: batch.splice(0, batch.length),
        skipDuplicates: true,
      });
      imported += result.count;
      skipped += attempted - result.count;

      if (imported % (options.batchSize * 10) === 0) {
        console.log(`Imported ${imported} rows...`);
      }
    };

    for await (const row of parser as AsyncIterable<CsvScoreRow>) {
      if (options.limit !== undefined && imported + batch.length >= options.limit) {
        break;
      }

      const toan = scoreToNumber(row.toan);
      const nguVan = scoreToNumber(row.ngu_van);
      const ngoaiNgu = scoreToNumber(row.ngoai_ngu);
      const vatLi = scoreToNumber(row.vat_li);
      const hoaHoc = scoreToNumber(row.hoa_hoc);
      const sinhHoc = scoreToNumber(row.sinh_hoc);
      const lichSu = scoreToNumber(row.lich_su);
      const diaLi = scoreToNumber(row.dia_li);
      const gdcd = scoreToNumber(row.gdcd);
      const groupATotal = computeGroupATotal(toan, vatLi, hoaHoc);

      batch.push({
        sbd: row.sbd,
        toan: decimalInput(toan),
        nguVan: decimalInput(nguVan),
        ngoaiNgu: decimalInput(ngoaiNgu),
        vatLi: decimalInput(vatLi),
        hoaHoc: decimalInput(hoaHoc),
        sinhHoc: decimalInput(sinhHoc),
        lichSu: decimalInput(lichSu),
        diaLi: decimalInput(diaLi),
        gdcd: decimalInput(gdcd),
        maNgoaiNgu: emptyToNull(row.ma_ngoai_ngu),
        groupATotal: decimalInput(groupATotal),
      });

      if (batch.length >= options.batchSize) {
        await flush();
      }
    }

    await flush();

    return { imported, skipped };
  }
}
