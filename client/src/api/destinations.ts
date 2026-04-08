import api from './client';
import type { Destination, PaginatedResponse } from '../types';

export interface DestinationFilters {
  category?: string;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export const destinationsApi = {
  getAll: async (filters: DestinationFilters = {}): Promise<PaginatedResponse<Destination>> => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.featured) params.append('featured', 'true');
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    const { data } = await api.get(`/destinations?${params.toString()}`);
    return data;
  },

  getById: async (id: string): Promise<Destination> => {
    const { data } = await api.get(`/destinations/${id}`);
    return data;
  },

  create: async (destination: Omit<Destination, 'id' | 'createdAt' | 'updatedAt'>): Promise<Destination> => {
    const { data } = await api.post('/destinations', destination);
    return data;
  },

  update: async (id: string, updates: Partial<Destination>): Promise<Destination> => {
    const { data } = await api.put(`/destinations/${id}`, updates);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/destinations/${id}`);
  },
};
