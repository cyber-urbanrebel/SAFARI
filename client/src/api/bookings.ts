import api from './client';
import type { Booking } from '../types';

export interface CreateBookingData {
  destinationId: string;
  startDate: string;
  endDate: string;
  guests: number;
  notes?: string;
}

export const bookingsApi = {
  getMyBookings: async (): Promise<Booking[]> => {
    const { data } = await api.get('/bookings/my');
    return data;
  },

  getAllBookings: async (): Promise<Booking[]> => {
    const { data } = await api.get('/bookings');
    return data;
  },

  create: async (bookingData: CreateBookingData): Promise<Booking> => {
    const { data } = await api.post('/bookings', bookingData);
    return data;
  },

  updateStatus: async (id: string, status: string): Promise<Booking> => {
    const { data } = await api.patch(`/bookings/${id}/status`, { status });
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/bookings/${id}`);
  },
};
