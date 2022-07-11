import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { List } from '@ui/components/List';
import { fetchVehicleList } from '../hooks/state';
import { VehicleListing } from './VehicleListing';
import { NoVehiclePage } from './NoVehiclePage';
import { GarageVehicle } from '@typings/garage';
import CircularProgress from '@mui/material/CircularProgress';

export const GarageApp: React.FC = () => {
  const [vehicleList, setVehicleList] = useState<GarageVehicle[]>(null);

  useEffect(() => {
    const getVehicles = async () => {
      const vehicleList = await fetchVehicleList();
      setVehicleList(vehicleList);
    };
    getVehicles();
  }, []);

  return (
    <Box height="100%" width="100%" p={2}>
      {vehicleList == null ? (
        <CircularProgress />
      ) : (
        <List>
          {vehicleList.length > 0 ? (
            vehicleList.map((vehicle) => <VehicleListing key={vehicle.id} {...vehicle} />)
          ) : (
            <NoVehiclePage />
          )}
        </List>
      )}
    </Box>
  );
};
