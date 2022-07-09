import React from 'react';
import { Box } from '@mui/material';
import { List } from '@ui/components/List';
import { useGrabVehicleList } from '../hooks/state';
import { VehicleListing } from './VehicleListing';

export const GarageApp: React.FC = () => {
  const vehicleList = useGrabVehicleList();
  return (
    <Box height="100%" width="100%" p={2}>
      <List>
        {vehicleList.map((vehicle) => (
          <VehicleListing key={vehicle.id} {...vehicle} />
        ))}
      </List>
    </Box>
  );
};
