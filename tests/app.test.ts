import request from 'supertest';
import type { Application } from 'express';
import { describe, expect, it } from '@jest/globals';
import app from '../src/app';

// Supertest agent type for Express 5 compatibility (has .get(), .post(), etc.)
type SupertestAgent = { get(url: string): { expect(status: number): Promise<{ body: Record<string, unknown> }> } };
const agent = request(app as Application) as unknown as SupertestAgent;

describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('should return healthy response', async () => {
      const response = await agent.get('/health').expect(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api', () => {
    it('should return API message', async () => {
      const response = await agent.get('/api').expect(200);
      expect(response.body).toHaveProperty(
        'message',
        'Requestion API is running!'
      );
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 error', async () => {
      const response = await agent.get('/nonexistent').expect(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });
});
