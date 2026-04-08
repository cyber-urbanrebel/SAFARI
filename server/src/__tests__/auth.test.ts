import { Request, Response } from 'express';
import { register, login } from '../controllers/authController';

jest.mock('../lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock_token'),
}));

import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';

const mockRes = () => {
  const res = {} as Response;
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('creates a new user successfully', async () => {
      const mockUser = {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'USER',
        createdAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const req = {
        body: { name: 'Test User', email: 'test@example.com', password: 'password123' },
      } as Request;
      const res = mockRes();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ user: mockUser, token: 'mock_token' });
    });

    it('returns 409 if email already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'existing' });

      const req = {
        body: { name: 'Test User', email: 'existing@example.com', password: 'password123' },
      } as Request;
      const res = mockRes();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email already registered' });
    });

    it('validates required fields', async () => {
      const req = { body: { email: 'bad-email', password: 'pw' } } as Request;
      const res = mockRes();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('login', () => {
    it('returns token on valid credentials', async () => {
      const mockUser = {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const req = {
        body: { email: 'test@example.com', password: 'password123' },
      } as Request;
      const res = mockRes();

      await login(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ token: 'mock_token' })
      );
    });

    it('returns 401 for wrong password', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed_password',
        role: 'USER',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const req = {
        body: { email: 'test@example.com', password: 'wrongpassword' },
      } as Request;
      const res = mockRes();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email or password' });
    });
  });
});
