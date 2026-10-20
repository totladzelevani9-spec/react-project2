import type { Room } from '../types';

export type ServicePricing = 'perNight' | 'perGuestPerNight' | 'flat';

export interface Service {
  id: string;
  name: string;
  price: number;
  pricing: ServicePricing;
}

export interface BookingFormValues {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface PriceBreakdown {
  nights: number;
  roomCost: number;
  servicesCost: number;
  subtotal: number;
  discountAmount: number;
  total: number;
}

export interface BookingSummary {
  room: Room;
  values: BookingFormValues;
  services: Service[];
  price: PriceBreakdown;
}