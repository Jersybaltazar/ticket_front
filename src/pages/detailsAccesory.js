import React from 'react';
import { useLocation } from 'react-router-dom';
import AccessoryDetailsFromQR from './AccessoryDetailsFromQR'; // Ajusta la ruta según la ubicación de tu componente

const DetailsAccessory = () => {
  const location = useLocation();
  const qrImageUrl = location.search.slice(1); // Eliminar el signo de interrogación (?)

  return <AccessoryDetailsFromQR qrImageUrl={qrImageUrl} />;
};

export default DetailsAccessory;
