import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import type { ScoreModuleServices } from '../src/modules/scores/score.routes.js';

const sampleStudent = {
  sbd: '01000001',
  scores: {
    toan: 8.4,
    nguVan: 6.75,
    ngoaiNgu: 8,
    vatLi: 6,
    hoaHoc: 5.25,
    sinhHoc: 5,
    lichSu: null,
    diaLi: null,
    gdcd: null,
  },
  maNgoaiNgu: 'N1',
  groupATotal: 19.65,
};

function createMockServices(): ScoreModuleServices {
  return {
    studentScoreService: {
      findByRegistrationNumber: vi.fn(async (sbd: string) => {
        if (sbd === '01000001') return sampleStudent;
        return null;
      }),
      getTopGroupA: vi.fn(async () => [
        {
          sbd: '01000001',
          toan: 8.4,
          vatLi: 6,
          hoaHoc: 5.25,
          groupATotal: 19.65,
        },
      ]),
    },
    reportService: {
      getScoreLevelReport: vi.fn(async () => [
        {
          subject: 'toan' as const,
          label: 'Math',
          levels: { excellent: 1, good: 2, average: 3, poor: 4 },
        },
      ]),
    },
  };
}

describe('score API', () => {
  it('returns a score by registration number', async () => {
    const app = createApp(createMockServices());

    const response = await request(app).get('/api/scores/01000001');

    expect(response.status).toBe(200);
    expect(response.body.sbd).toBe('01000001');
    expect(response.body.scores.toan).toBe(8.4);
  });

  it('rejects invalid registration numbers', async () => {
    const app = createApp(createMockServices());

    const response = await request(app).get('/api/scores/abc');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Registration number must be exactly 8 digits');
  });

  it('returns 404 when a registration number is not found', async () => {
    const app = createApp(createMockServices());

    const response = await request(app).get('/api/scores/99999999');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Score not found');
  });

  it('returns the score level report', async () => {
    const app = createApp(createMockServices());

    const response = await request(app).get('/api/reports/score-levels');

    expect(response.status).toBe(200);
    expect(response.body[0].subject).toBe('toan');
    expect(response.body[0].levels.excellent).toBe(1);
  });

  it('validates top group A limit', async () => {
    const app = createApp(createMockServices());

    const response = await request(app).get('/api/top/group-a?limit=99');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Limit must be an integer from 1 to 50');
  });

  it('returns top group A students', async () => {
    const app = createApp(createMockServices());

    const response = await request(app).get('/api/top/group-a?limit=10');

    expect(response.status).toBe(200);
    expect(response.body[0].sbd).toBe('01000001');
    expect(response.body[0].groupATotal).toBe(19.65);
  });
});
