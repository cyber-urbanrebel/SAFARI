import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { Category } from '@prisma/client';

export const getDestinations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, featured, search, page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};

    if (category && category !== 'ALL') {
      where.category = category as Category;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { location: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: [{ featured: 'desc' }, { rating: 'desc' }],
      }),
      prisma.destination.count({ where }),
    ]);

    res.json({
      destinations,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get destinations error:', error);
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
};

export const getDestinationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const destination = await prisma.destination.findUnique({ where: { id } });

    if (!destination) {
      res.status(404).json({ error: 'Destination not found' });
      return;
    }

    res.json(destination);
  } catch (error) {
    console.error('Get destination error:', error);
    res.status(500).json({ error: 'Failed to fetch destination' });
  }
};

const destinationSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  location: z.string().min(2),
  imageUrl: z.string().url(),
  price: z.number().positive(),
  category: z.enum(['SAFARI', 'BEACH', 'MOUNTAIN', 'CULTURAL', 'WILDLIFE', 'ADVENTURE']),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
  featured: z.boolean().optional(),
});

export const createDestination = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = destinationSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors[0].message });
      return;
    }

    const destination = await prisma.destination.create({ data: parsed.data });
    res.status(201).json(destination);
  } catch (error) {
    console.error('Create destination error:', error);
    res.status(500).json({ error: 'Failed to create destination' });
  }
};

export const updateDestination = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const parsed = destinationSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors[0].message });
      return;
    }

    const destination = await prisma.destination.update({
      where: { id },
      data: parsed.data,
    });

    res.json(destination);
  } catch (error) {
    console.error('Update destination error:', error);
    res.status(500).json({ error: 'Failed to update destination' });
  }
};

export const deleteDestination = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.destination.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Delete destination error:', error);
    res.status(500).json({ error: 'Failed to delete destination' });
  }
};
