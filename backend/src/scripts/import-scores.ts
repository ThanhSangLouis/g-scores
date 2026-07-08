import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { prisma } from '../lib/prisma.js';
import { ScoreImportService } from '../modules/scores/score-import.service.js';

function getArgValue(name: string) {
  const prefix = `--${name}=`;
  const inline = process.argv.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);

  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0) return process.argv[index + 1];

  return undefined;
}

function hasFlag(name: string) {
  return process.argv.includes(`--${name}`);
}

const defaultCsvPath = resolve(process.cwd(), '..', 'dataset', 'diem_thi_thpt_2024.csv');
const filePath = resolve(getArgValue('file') ?? defaultCsvPath);
const batchSize = Number(getArgValue('batch-size') ?? 5000);
const limitArg = getArgValue('limit');
const limit = limitArg === undefined ? undefined : Number(limitArg);

if (!existsSync(filePath)) {
  console.error(`CSV file not found: ${filePath}`);
  process.exit(1);
}

if (!Number.isInteger(batchSize) || batchSize < 1) {
  console.error('--batch-size must be a positive integer');
  process.exit(1);
}

if (limit !== undefined && (!Number.isInteger(limit) || limit < 1)) {
  console.error('--limit must be a positive integer');
  process.exit(1);
}

const importer = new ScoreImportService(prisma);

try {
  const startedAt = Date.now();
  const result = await importer.importFromCsv({
    filePath,
    batchSize,
    reset: hasFlag('reset'),
    limit,
  });
  const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);

  console.log(`Import finished in ${seconds}s`);
  console.log(`Imported: ${result.imported}`);
  console.log(`Skipped duplicates: ${result.skipped}`);
} finally {
  await prisma.$disconnect();
}
