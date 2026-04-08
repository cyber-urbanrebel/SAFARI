import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

const bookingSchema = z.object({
  destinationId: z.string().min(1, 'Destination is required'),
  startDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid start date'),
  endDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid end date'),
  guests: z.number().int().min(1, 'At least 1 guest required').max(20, 'Maximum 20 guests'),
  notes: z.string().optional(),
});

export const getMyBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        destination: {
          select: { id: true, name: true, location: true, imageUrl: true, category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const getAllBookings = async (_req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        destination: { select: { id: true, name: true, location: true, imageUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(bookings);
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parsed = bookingSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors[0].message });
      return;
    }

    const userId = req.user!.id;
    const { destinationId, startDate, endDate, guests, notes } = parsed.data;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      res.status(400).json({ error: 'End date must be after start date' });
      return;
    }

    const destination = await prisma.destination.findUnique({ where: { id: destinationId } });
    if (!destination) {
      res.status(404).json({ error: 'Destination not found' });
      return;
    }

    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = destination.price * guests * nights;

    const booking = await prisma.booking.create({
      data: {
        userId,
        destinationId,
        startDate: start,
        endDate: end,
        guests,
        totalPrice,
        notes,
        status: 'PENDING',
      },
      include: {
        destination: {
          select: { id: true, name: true, location: true, imageUrl: true, category: true },
        },
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    // Non-admin users can only cancel their own bookings
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    if (req.user?.role !== 'ADMIN' && booking.userId !== req.user?.id) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    if (req.user?.role !== 'ADMIN' && status !== 'CANCELLED') {
      res.status(403).json({ error: 'Users can only cancel bookings' });
      return;
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        destination: {
          select: { id: true, name: true, location: true, imageUrl: true },
        },
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

export const deleteBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    if (req.user?.role !== 'ADMIN' && booking.userId !== req.user?.id) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    await prisma.booking.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};
