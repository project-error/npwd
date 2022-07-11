import React from 'react';
import { Box } from '@mui/material';
import { List } from '@ui/components/List';
import { useGrabVehicleList } from '../hooks/state';
import { VehicleListing } from './VehicleListing';
import { NoVehiclePage } from './NoVehiclePage';

export const GarageApp: React.FC = () => {
  const vehicleList = useGrabVehicleList();

  return (
    <Box height="100%" width="100%" p={2}>
      <List>
        {vehicleList.length > 0 ? (
          vehicleList.map((vehicle) => <VehicleListing key={vehicle.id} {...vehicle} />)
        ) : (
          <NoVehiclePage />
        )}
      </List>
    </Box>
  );
};
