import { GarageEvents } from '../../typings/garage';
import { RegisterNuiProxy, RegisterNuiCB } from './cl_utils';

RegisterNuiProxy(GarageEvents.GET_VEHICLE_LIST);

RegisterNuiCB(GarageEvents.RESOLVE_HASH_TO_MODEL_NAME, ({ model }: { model: number }): string => {
  console.log('Line 7: ' + model);
  console.log('Line 8:' + GetDisplayNameFromVehicleModel(model));
  console.log('Line 9:' + GetDisplayNameFromVehicleModel(model.toString()));
  console.log('Line 10: ' + GetLabelText(GetDisplayNameFromVehicleModel(model)));
  console.log('Line 11: ' + GetLabelText(GetDisplayNameFromVehicleModel(model.toString())));
  return GetLabelText(GetDisplayNameFromVehicleModel(model));
});
