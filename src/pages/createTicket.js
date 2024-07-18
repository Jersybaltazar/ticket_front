import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
} from "@mui/material";
import { DatePicker, LocalizationProvider,TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import QRCode from "qrcode";

const CreateTicket = () => {
  const [logo, setLogoImage] = useState(null); // Aquí podrías manejar la imagen del logo o QR
  const [selectedDate, setSelectedDate] = useState(null);
  const [name, setName] = useState("");
  const [qrSize, setQrSize] = useState("100");
  const [selectedMaintenance, setSelectedMaintenance] = useState("");
  const [price, setPrice] = useState("");
  const [asistent, setAsistent] = useState("");
  const [hour, setHour] = useState(null);
  const [createdQrId, setCreatedQrId] = useState(null);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };
  const handleHourChange = (newHour) => {
    setHour(newHour);
  };
  const handleAsistentChange = (event) => {
    setAsistent(event.target.value);
  };

  const handlepriceChange = (event) => {
    setPrice(event.target.value);
  };
  const handleQrSizeChange = (event) => {
    setQrSize(event.target.value);
  };

  function generateUniqueValue() {
    const timestamps = new Date().getTime();
    const randomValue = Math.floor(Math.random() * 10000);
    const uniqueValue = `${timestamps}-${randomValue}`;
    return uniqueValue;
  }
  const handleGenerateQR = async () => {
    try {
      const baseUrl = "https://ticket-front-1.onrender.com/details/";
      const uniqueValue = generateUniqueValue();
      const qrUrl = baseUrl + uniqueValue;

      // const qrUrl  = `https://ticket-front-1.onrender.com/details/${uniqueValue}`;

      const canvas = await QRCode.toCanvas(qrUrl, {
        width: parseInt(qrSize),
        height: parseInt(qrSize),
      });
      const qrDataURL = canvas.toDataURL("image/png");

      setLogoImage(qrDataURL);

      const link = document.createElement("a");
      link.href = qrDataURL;
      link.download = "codigo_qr.png";
      link.click();

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/codeqr/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: uniqueValue,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const createdQrId = responseData.code;
        setCreatedQrId(createdQrId);
      } else {
        console.error("Error guardando el código QR en el backend");
      }
    } catch (error) {
      console.error("Error generando el código QR", error);
    }
  };
  const renderTextField = (label, id, handleChange) => (
    <Grid container spacing={1} style={{ alignItems: "center" }}>
      <Grid item xs={4}>
        <Typography variant="body1">{label}</Typography>
      </Grid>

      {id === "codeqr" && (
        <Grid item xs={8} container spacing={1} alignItems="center">
          <Grid item>
            <FormControl fullWidth>
              <InputLabel> </InputLabel>
              <Select
                value={qrSize}
                onChange={handleQrSizeChange}
                style={{ width: "100%" }}
              >
                <MenuItem value="100">Pequeño</MenuItem>
                <MenuItem value="200">Mediano</MenuItem>
                <MenuItem value="300">Grande</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <Button variant="outlined" onClick={handleGenerateQR}>
              Generar QR
            </Button>
          </Grid>
        </Grid>
      )}

      {id !== "codeqr" && id !== "tipoasiento" && (
        <Grid item xs={8}>
          <FormControl fullWidth margin="normal">
            {id === "date" ? (
              <DatePicker
                label="Escoja una fecha"
                sx={{
                  width: "40%",
                  height: "80%",
                }}
                value={selectedDate}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            ):id ==="hour" ?(
                <TimePicker
                label="Escoja una Hora"
                value={hour}
                onChange={handleHourChange}
                renderInput={(params)=>(
                    <TextField {...params} 
                    sx={{
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "8px",
                        width: "80%",
                        height: "40px",
                      }}
                    />
                )}
              />
            
            ) : (
              <Input
                id={id}
                value={
                  id === "nombre_event"
                    ? name
                    : id === "hour"
                    ? hour
                    : id === "nombreasistente"
                    ? asistent
                    : id === "precio"
                    ? price
                    : ""
                }
                onChange={handleChange}
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "8px",
                  width: "80%",
                  height: "40px",
                }}
              />
            )}
          </FormControl>
        </Grid>
      )}
      {id === "tipoasiento" && (
        <Grid item xs={8}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo de Entrada(días)</InputLabel>
            <Select
              value={selectedMaintenance}
              onChange={(event) => setSelectedMaintenance(event.target.value)}
              style={{ width: "80%", height: "40px" }}
            >
              {["general", "vip", "box"].map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}
    </Grid>
  );
  const handleCreateTicket = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_name:name,
          date: selectedDate,
          time:hour,
          attendee_name:asistent,
          seat: selectedMaintenance,
          price,
          qr_code: createdQrId,
        }),
      });

      if (response.ok) {
        // Ticket creado exitosamente en el backend
        setName("");
        setSelectedDate(null);
        setHour(null);
        setAsistent("");
        setSelectedMaintenance("");
        setPrice("");
        setCreatedQrId(null);
      } else {
        console.error("Error al crear el ticket en el backend");
      }
    } catch (error) {
      console.error("Error al crear el ticket", error);
    }
  };

  return (
    <Container style={{ marginTop: "100px" }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={4}>
          <Grid
            item
            xs={4}
            style={{
              backgroundColor: "#ffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {logo ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <canvas
                  ref={(canvas) => {
                    if (canvas) {
                      const context = canvas.getContext("2d");
                      const image = new Image();
                      image.src = logo;
                      image.onload = () => {
                        context.drawImage(image, 0, 0);
                      };
                    }
                  }}
                  style={{
                    width: "300px", // Ajusta este valor para controlar el tamaño del código QR
                    height: "200px", // Ajusta este valor para controlar el tamaño del código QR
                    margin: "block", // Centra horizontalmente el elemento
                    display: "block", // Elimina el espacio adicional debajo del canvas
                  }}
                />
              </div>
            ) : (
              <Typography variant="h5" align="center">
                Crea tu boleto
              </Typography>
            )}
          </Grid>

          <Grid item xs={8} style={{ paddingLeft: "20px" }}>
            <form>
              {renderTextField(
                "Nombre del Evento:",
                "nombre_event",
                handleNameChange
              )}
              {renderTextField("fecha:", "date", handleDateChange)}
              {renderTextField("Hora:", "hour", handleHourChange)}
              {renderTextField(
                "Nombre de Asistente",
                "nombreasistente",
                handleAsistentChange
              )}
              {renderTextField("Tipo de Asiento", "tipoasiento")}
              {renderTextField("Precio", "precio", handlepriceChange)}
              {renderTextField("Codeqr:", "codeqr")}
            </form>
          </Grid>

          <Grid
            item
            xs={8}
            style={{
              paddingLeft: "16px",
              display: "flex",
              justifyContent: "flex-end", // Alineación a la derecha
              marginTop: "20px",
            }}
          >
            <Button
              variant="contained"
              onClick={handleCreateTicket}
              style={{ marginTop: "20px" }}
            >
              Crear Ticket
            </Button>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Container>
  );
};
export default CreateTicket;
