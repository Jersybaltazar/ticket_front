import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Modal,
  Box,
  FormControl,
  FormControlLabel,
  InputLabel,
  Checkbox,
  Select,
  MenuItem,
} from "@mui/material";



const AccessoryCard = ({ accessory, onDelete, onEdit }) => {
  const { id_accesorie, name, brand, purchase_date, mantenimiento, img,} = accessory;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [maintenanceState, setMaintenanceState] = useState("Pendiente");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState("");
  // const [maintenanceCount, setMaintenanceCount] = useState(0);

  // const handleMaintenanceToggle = () => {
  //   const updatedAccessory = {
  //     ...accessory,
  //     maintenanceCount: accessory.maintenanceCount + 1,
  //     maintenanceState: accessory.maintenanceState === "Pendiente" ? "Ejecutado" : "Pendiente",
  //   };
  //   onUpdate(updatedAccessory);
  // };

  const handleDeleteClick = () => {
    onDelete(id_accesorie);
  };

  // const handleEditClick = () => {
  //   setIsEditModalOpen(true);
  // };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };


 
  const handleMaintenanceToggle = () => {
    setMaintenanceState(
      maintenanceState === "Pendiente" ? "Ejecutado" : "Pendiente"
    );
  };
  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };
  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedField("");
  };
  const handleFieldChange = (event) => {
    setSelectedField(event.target.value);
  };

  const handleEditConfirm = () => {
    
   // Aquí podrías pasar el accesorio y el campo seleccionado al componente padre (AccessoryList)
   onEdit(accessory, selectedField);
   handleEditModalClose();
  };

  const getNextMaintenanceDate = (startDate, maintenanceDays) => {
    startDate = new Date(startDate);
    startDate.setDate(startDate.getDate() + maintenanceDays);
    return startDate;
  };
  const today = new Date();

  const nextMaintenanceDate = getNextMaintenanceDate(
    maintenanceState === "Ejecutado" ? today : purchase_date,
    parseInt(mantenimiento)
  );
  // const nextMaintenanceDate = getNextMaintenanceDate(purchase_date, parseInt(mantenimiento));

  const daysUntilNextMaintenance = Math.ceil(
    (nextMaintenanceDate - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card>
      {img  && <CardMedia component="img" height="100" image={accessory.img} alt={accessory.name} />}
      <CardContent>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="body2">Marca: {brand}</Typography>
        <Typography variant="body2">
          Fecha de Compra: {purchase_date}
        </Typography>
        <Typography variant="body2">Frecuencia: {mantenimiento}</Typography>
        <Typography variant="body2">
          Estado de Mantenimiento:
          <Typography
            component="span"
            sx={{
              color: "#3f51b5",
              textDecoration: "underline",
              cursor: "pointer",
              "&:hover": {
                color: "#303f9f",
              },
            }}
            onClick={handleModalOpen}
          >
            Ver
          </Typography>
        </Typography>
        <Box
          sx={{ 
            marginTop: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
        
    
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleDeleteClick}
          >
            Eliminar
          </Button>
          <Button variant="outlined" color="primary" onClick={handleEditClick}>
            Actualizar
          </Button>
        </Box>
      </CardContent>
      <Modal open={isEditModalOpen} onClose={handleEditModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h5">Editar Accesorio</Typography>
          <FormControl fullWidth>
            <InputLabel>Escoja un campo a editar</InputLabel>
            <Select value={selectedField} onChange={handleFieldChange}>
              <MenuItem value="name">Nombre</MenuItem>
              <MenuItem value="brand">Marca</MenuItem>
              <MenuItem value="model">Modelo</MenuItem>
              <MenuItem value="pruchase_date">Fecha trabajo</MenuItem>
              <MenuItem value="Price">Precio</MenuItem>
              <MenuItem value="Parts">Piezas</MenuItem>
              <MenuItem value="induction">Induction</MenuItem>
              <MenuItem value="img">Img</MenuItem>
              <MenuItem value="mantenimiento">Mantenimiento</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditConfirm}
          >
            Confirmar
          </Button>
        </Box>
      </Modal>

      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h5">Detalles de Mantenimiento</Typography>
          <Typography variant="body1">Estado: {maintenanceState}</Typography>
          <Typography variant="body1">
            Próximo Mantenimiento: {nextMaintenanceDate.toLocaleDateString()}
          </Typography>
          <Typography variant="body1">
            Días Restantes: {daysUntilNextMaintenance}
          </Typography>
        </Box>
      </Modal>
    </Card>
  );
};

export default AccessoryCard;
