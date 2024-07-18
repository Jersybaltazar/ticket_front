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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import QRCode from "qrcode";
// import '@mui/x-date-pickers/dist/DatePicker.css';

const CreateAccessory = () => {
  const [logo, setLogoImage] = useState(null); // Aquí podrías manejar la imagen del logo o QR
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [qrSize, setQrSize] = useState("100");
  const [selectedMaintenance, setSelectedMaintenance] = useState(1);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [parts, setParts] = useState("");
  const [induction, setInduction] = useState("");
  const [mantenimiento, setmantenimiento] = useState("");
  const [img, setImg] = useState("");
  const [purchase_date, setPurchase_date] = useState("");
  const [code_QR, setCode_QR] = useState("");
  const [createdQrId, setCreatedQrId] = useState(null);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleBrandChange = (event) => {
    setBrand(event.target.value);
  };

  const handleModelChange = (event) => {
    setModel(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handlePartsChange = (event) => {
    setParts(event.target.value);
  };
  const handleQrSizeChange = (event) => {
    setQrSize(event.target.value);
  };
  const handleInductionChange = (event) => {
    setInduction(event.target.value);
  };
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  function generateUniqueValue() {
    const timestamps = new Date().getTime();
    const randomValue = Math.floor(Math.random() * 10000);
    const uniqueValue = `${timestamps}-${randomValue}`;
    return uniqueValue;
  }

  const handleGenerateQR = async () => {
    try {
      const baseUrl = "http://localhost:3000/details/";
      const uniqueValue = generateUniqueValue();
      const qrUrl = baseUrl + uniqueValue;

      // const qrUrl  = `http://localhost:3000/details/${uniqueValue}`;

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
      

      const response = await fetch("http://localhost:3001/codeqr/save", {
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

  const handleCreateAccessory = async () => {
    try {
      const imageBase64 = selectedImage.split(",")[1];

      const response = await fetch("http://localhost:3001/accesories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          brand,
          model,
          price,
          parts,
          induction,
          mantenimiento: selectedMaintenance, // Debes usar el valor seleccionado en tu estado
          img,
          imageBase64, // Debes usar la imagen seleccionada en tu estado
          purchase_date: selectedDate, // Debes usar la fecha seleccionada en tu estado
          createdQrId, // Debes usar el valor del código QR en tu estado
        }),
      });

      if (response.ok) {
        // Accesorio creado exitosamente en el backend
        setName("");
        setBrand(""); 
        setModel("");
        setPrice("");
        setParts("");
        setInduction("");
        setSelectedMaintenance(1);
        setSelectedImage(null);
        setSelectedDate(null);
        setLogoImage(null);
        setCode_QR("");
        setCreatedQrId(null);
      } else {
        console.error("Error al crear el accesorio en el backend");
      }
    } catch (error) {
      console.error("Error al crear el accesorio", error);
    }
  };
  //renderizamiento del formulario los label e inputs
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

      {id !== "codeqr" && id !== "mantenimiento" && (
        <Grid item xs={8}>
          <FormControl fullWidth margin="normal">
            {id === "fechatrabajo" ? (
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
            ) : (
              <Input
                id={id}
                value={
                  id === "nombre"
                    ? name
                    : id === "marca"
                    ? brand
                    : id === "modelo"
                    ? model
                    : id === "precio"
                    ? price
                    : id === "modouso"
                    ? induction
                    : parts
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
      {id === "mantenimiento" && (
        <Grid item xs={8}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Mantenimiento (días)</InputLabel>
            <Select
              value={selectedMaintenance}
              onChange={(event) => setSelectedMaintenance(event.target.value)}
              style={{ width: "80%", height: "40px" }}
            >
              {Array.from({ length: 100 }, (_, index) => index + 1).map(
                (number) => (
                  <MenuItem key={number} value={number}>
                    {number}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </Grid>
      )}
    </Grid>
  );

  const renderImageField = (label, id, handleChange) => (
    <Grid container spacing={1} style={{ alignItems: "center" }}>
      <Grid item xs={4}>
        <Typography variant="body1">{label}</Typography>
      </Grid>
      <Grid item xs={8}>
        <FormControl fullWidth margin="normal">
          <input
            accept="image/*"
            id={id}
            type="file"
            onChange={handleImageChange} // Asegúrate de definir esta función
            style={{ display: "none" }}
          />
          <label htmlFor={id}>
            <Button variant="outlined" component="span">
              Seleccionar Imagen
            </Button>
          </label>
          {selectedImage && (
            <div>
              <img
                src={selectedImage}
                alt="Preview"
                style={{ maxWidth: "100%", marginTop: "10px" }}
              />
            </div>
          )}
        </FormControl>
      </Grid>
    </Grid>
  );

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
                olympo
              </Typography>
            )}
          </Grid>

          <Grid item xs={8} style={{ paddingLeft: "20px" }}>
            <form>
              {renderTextField("Nombre:"  , "nombre", handleNameChange)}
              {renderTextField("Marca:", "marca", handleBrandChange)}
              {renderTextField("Modelo:", "modelo", handleModelChange)}
              {renderTextField("Fecha Trabajo:", "fechatrabajo")}
              {renderTextField("Precio:", "precio", handlePriceChange)}
              {renderTextField("Piezas:", "piezas", handlePartsChange)}
              {renderTextField(
                "Modo de uso:",
                "modouso",
                handleInductionChange
              )}
              {renderImageField("Imagen:", "imagen", handleImageChange)}
              {renderTextField("Mantenimiento:", "mantenimiento")}
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
              onClick={handleCreateAccessory}
              style={{ marginTop: "20px" }}
            >
              Crear
            </Button>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Container>
  );
};

export default CreateAccessory;
