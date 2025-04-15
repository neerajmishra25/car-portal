export interface Location {
  latitude: number;
  longitude: number;
}

export interface TirePressure {
  frontLeft: number;
  frontRight: number;
  rearLeft: number;
  rearRight: number;
}

export interface VehicleData {
  batteryLevel: number;
  fuelLevel: number;
  odometer: number;
  speed: number;
  engineTemp: number;
  tirePressure: TirePressure;
}

export interface VehicleEvent {
  id: string;
  vehicleId: string;
  timestamp: string;
  eventType: 'IGNITION_ON' | 'IGNITION_OFF' | 'TIME_INTERVAL';
  location: Location;
  data: VehicleData;
}

export interface VehicleStats {
  lastUpdate: string;
  currentLocation: Location;
  batteryLevel: number;
  fuelLevel: number;
  odometer: number;
  status: 'Active' | 'Inactive';
} 