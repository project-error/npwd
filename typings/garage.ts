export interface GarageVehicle {
  id: number;
  model: string;
  plate: string;
  garage_name: string;
  garage_location: number[];
  health: number;
}

export enum GarageEvents {
  GET_VEHICLE_LIST = 'npwd:getVehicleList',
}
