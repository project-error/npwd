export interface GarageVehicle {
  id: number;
  model: string;
  plate: string;
  garageId: number;
  health: number;
  stored: number;
}

export interface FIVEM_COORDS {
  x: number;
  y: number;
  z: number;
  h: number;
}

export interface GarageHub {
  location: FIVEM_COORDS;
  name: string;
}

export enum GarageEvents {
  GET_VEHICLE_LIST = 'npwd:getVehicleList',
}
