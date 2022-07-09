import { GarageVehicle } from '@typings/garage';

export const BrowserGarageState: GarageVehicle[] = [
  {
    id: 1,
    model: 'Comet',
    plate: 'YESSIR',
    garage_name: 'West Coast Customs',
    garage_location: [100, 200, 300],
    health: 100,
  },
  {
    id: 2,
    model: 'Velociraptor',
    plate: 'YEEHAWK',
    garage_name: 'Vanilla Unicorn',
    garage_location: [23.1, 21.2, -33.2],
    health: 21,
  },
  {
    id: 3,
    model: 't20',
    plate: 'FEELSGOD',
    garage_name: 'East Coast Customs',
    garage_location: [12.1, -23.2, 43.2],
    health: 60,
  },
  {
    id: 4,
    model: 'Comet2',
    plate: 'WOWSKI3',
    garage_name: 'West Coast Salvage',
    garage_location: [100.12, 200.42, 300.52],
    health: 100,
  },
];
