import type { Room } from '../types';
import type { Service, ServicePricing } from '../types/booking';

export const ROOMS: Room[] = [
  {
    id: 1,
    name: 'Standard Single',
    price: 60,
    capacity: 1,
    rating: 4.1,
    status: 'Available',
    image: 'https://picsum.photos/seed/room1/400/240',
  },
  {
    id: 2,
    name: 'Standard Double',
    price: 95,
    capacity: 2,
    rating: 4.4,
    status: 'Available',
    image: 'https://picsum.photos/seed/room2/400/240',
  },
  {
    id: 3,
    name: 'Deluxe Double',
    price: 140,
    capacity: 2,
    rating: 4.7,
    status: 'Occupied',
    image: 'https://picsum.photos/seed/room3/400/240',
  },
  {
    id: 4,
    name: 'Family Room',
    price: 180,
    capacity: 4,
    rating: 4.5,
    status: 'Available',
    image: 'https://picsum.photos/seed/room4/400/240',
  },
  {
    id: 5,
    name: 'Junior Suite',
    price: 230,
    capacity: 3,
    rating: 4.8,
    status: 'Available',
    image: 'https://picsum.photos/seed/room5/400/240',
  },
  {
    id: 6,
    name: 'Executive Suite',
    price: 320,
    capacity: 4,
    rating: 4.9,
    status: 'Occupied',
    image: 'https://picsum.photos/seed/room6/400/240',
  },
  {
    id: 7,
    name: 'Penthouse',
    price: 520,
    capacity: 6,
    rating: 5.0,
    status: 'Available',
    image: 'https://picsum.photos/seed/room7/400/240',
  },
  {
    id: 8,
    name: 'Economy Twin',
    price: 75,
    capacity: 2,
    rating: 3.9,
    status: 'Available',
    image: 'https://picsum.photos/seed/room8/400/240',
  },
];

export const SERVICES: Service[] = [
  { id: 'breakfast', name: 'საუზმე', price: 15, pricing: 'perGuestPerNight' },
  { id: 'spa', name: 'სპა', price: 80, pricing: 'flat' },
  { id: 'transfer', name: 'ტრანსფერი', price: 40, pricing: 'flat' },
];

export const PRICING_LABELS: Record<ServicePricing, string> = {
  perNight: 'ღამეში',
  perGuestPerNight: 'სტუმარზე / ღამეში',
  flat: 'ერთჯერადად',
};