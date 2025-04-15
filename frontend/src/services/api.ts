import axios from 'axios';
import { VehicleEvent, VehicleStats } from '../types/vehicle';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  getAllEvents: async (): Promise<VehicleEvent[]> => {
    const response = await axios.get(`${API_BASE_URL}/events`);
    return response.data;
  },

  getEventsByType: async (eventType: string): Promise<VehicleEvent[]> => {
    const response = await axios.get(`${API_BASE_URL}/events/type/${eventType}`);
    return response.data;
  },

  getEventsByTimeframe: async (start?: string, end?: string): Promise<VehicleEvent[]> => {
    const params = new URLSearchParams();
    if (start) params.append('start', start);
    if (end) params.append('end', end);
    const response = await axios.get(`${API_BASE_URL}/events/timeframe?${params}`);
    return response.data;
  },

  getVehicleStats: async (vehicleId: string): Promise<VehicleStats> => {
    const response = await axios.get(`${API_BASE_URL}/vehicle/${vehicleId}/stats`);
    return response.data;
  }
}; 