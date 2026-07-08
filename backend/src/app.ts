import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { HttpError } from './lib/http-error.js';
import { createScoreRouter, type ScoreModuleServices } from './modules/scores/score.routes.js';

export function createApp(scoreServices?: ScoreModuleServices) {
  const app = express();
  const allowedOrigins = new Set(
    env.CORS_ORIGIN.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  );

  if (env.NODE_ENV !== 'production') {
    allowedOrigins.add('http://localhost:5173');
    allowedOrigins.add('http://localhost:5174');
    allowedOrigins.add('http://127.0.0.1:5173');
    allowedOrigins.add('http://127.0.0.1:5174');
  }

  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`CORS blocked origin: ${origin}`));
      },
    }),
  );
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api', createScoreRouter(scoreServices));

  const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ message: error.message, details: error.details });
      return;
    }

    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  };

  app.use(errorHandler);

  return app;
}
