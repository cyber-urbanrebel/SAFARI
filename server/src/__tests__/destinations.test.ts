import { Request, Response } from 'express';
import { getDestinations, getDestinationById } from '../controllers/destinationController';

// Mock prisma
jest.mock('../lib/prisma', () => ({
  __esModule: true,
  default: {
    destination: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import prisma from '../lib/prisma';

const mockRes = () => {
  const res = {} as Response;
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('Destination Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDestinations', () => {
    it('returns paginated destinations', async () => {
      const mockDests = [
        { id: '1', name: 'Maasai Mara', category: 'SAFARI', price: 350 },
        { id: '2', name: 'Diani Beach', category: 'BEACH', price: 200 },
      ];

      (prisma.destination.findMany as jest.Mock).mockResolvedValue(mockDests);
      (prisma.destination.count as jest.Mock).mockResolvedValue(2);

      const req = { query: {} } as Request;
      const res = mockRes();

      await getDestinations(req, res);

      expect(res.json).toHaveBeenCalledWith({
        destinations: mockDests,
        pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
      });
    });

    it('filters by category', async () => {
      (prisma.destination.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.destination.count as jest.Mock).mockResolvedValue(0);

      const req = { query: { category: 'SAFARI' } } as unknown as Request;
      const res = mockRes();

      await getDestinations(req, res);

      expect(prisma.destination.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ category: 'SAFARI' }),
        })
      );
    });
  });

  describe('getDestinationById', () => {
    it('returns destination by id', async () => {
      const mockDest = { id: 'abc', name: 'Maasai Mara' };
      (prisma.destination.findUnique as jest.Mock).mockResolvedValue(mockDest);

      const req = { params: { id: 'abc' } } as unknown as Request;
      const res = mockRes();

      await getDestinationById(req, res);

      expect(res.json).toHaveBeenCalledWith(mockDest);
    });

    it('returns 404 for missing destination', async () => {
      (prisma.destination.findUnique as jest.Mock).mockResolvedValue(null);

      const req = { params: { id: 'nonexistent' } } as unknown as Request;
      const res = mockRes();

      await getDestinationById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Destination not found' });
    });
  });
});
