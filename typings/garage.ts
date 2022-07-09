export interface GarageVehicle {
  id: number;
  model: number;
  plate: string;
  garageId: number;
  health: number;
  model_name?: string;
  garage_name?: string;
  garage_location?: number[];
}

export enum GarageEvents {
  GET_VEHICLE_LIST = 'npwd:getVehicleList',
}
