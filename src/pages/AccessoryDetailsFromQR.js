import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, Typography, Modal, Box } from "@mui/material";

const AccessoryDetailsPage = () => {
  const { code_QR } = useParams(); // Obtener el ID del accesorio de los parámetros de la URL
  const [accessoryDetails, setAccessoryDetails] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/codeqr/qr/${encodeURIComponent(code_QR)}`)
      .then((response) => {
        setAccessoryDetails(response.data);
      })
      .catch((error) => {
        console.error("Error obteniendo detalles del accesorio", error);
      });
  }, [code_QR]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {accessoryDetails ? (
        <Card style={{ maxWidth: 400 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {accessoryDetails.event_name}
            </Typography>
            <Typography variant="body1">
              Asistente:{accessoryDetails.attendee_name}
            </Typography>
            <Typography variant="body1">Entrada:{accessoryDetails.seat}</Typography>
            <Typography variant="body1">Precio{accessoryDetails.price}</Typography>

            <Typography variant="body1">Fecha:{accessoryDetails.date}</Typography>

            <Typography variant="body1">Hora:{accessoryDetails.time}</Typography>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="h6">Cargando detalles del accesorio...</Typography>
      )}
    </div>
  );
};

export default AccessoryDetailsPage;
