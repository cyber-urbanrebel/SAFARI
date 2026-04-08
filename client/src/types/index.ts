export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export type Category = 'SAFARI' | 'BEACH' | 'MOUNTAIN' | 'CULTURAL' | 'WILDLIFE' | 'ADVENTURE';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Destination {
  id: string;
  name: string;
  description: string;
  location: string;
  imageUrl: string;
  price: number;
  category: Category;
  rating: number;
  reviewCount: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  destinationId: string;
  startDate: string;
  endDate: string;
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  destination?: Pick<Destination, 'id' | 'name' | 'location' | 'imageUrl' | 'category'>;
  user?: Pick<User, 'id' | 'name' | 'email'>;
}

export interface PaginatedResponse<T> {
  destinations: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}
