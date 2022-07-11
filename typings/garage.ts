export interface GarageVehicle {
  id: number;
  model: string;
  plate: string;
  garageId: number;
  health: number;
  stored: number;
  model_name?: string;
  garage_name?: string;
  garage_location?: number[];
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
  RESOLVE_HASH_TO_MODEL_NAME = 'npwd:getModelFromHash',
}
