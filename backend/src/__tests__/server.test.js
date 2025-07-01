const request = require('supertest');
const app = require('../server');

describe('Server', () => {
  describe('GET /health', () => {
    it('should return 200 and health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('environment', 'test');
    });
  });

  describe('GET /api/users', () => {
    it('should return 401 without authentication', async () => {
      await request(app)
        .get('/api/users')
        .expect(401);
    });
  });

  describe('POST /api/users', () => {
    it('should create a user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        firebaseUid: 'test-uid-123',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(userData.email);
      expect(response.body.name).toBe(userData.name);
      expect(response.body.role).toBe('USER');
      expect(response.body.isActive).toBe(true);
    });

    it('should return 400 with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        name: 'Test User',
        firebaseUid: 'test-uid-123',
      };

      await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);
    });

    it('should return 400 with missing required fields', async () => {
      const userData = {
        email: 'test@example.com',
        // missing name and firebaseUid
      };

      await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);
    });
  });

  describe('404 handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Route not found');
      expect(response.body).toHaveProperty('path', '/non-existent-route');
    });
  });
}); 