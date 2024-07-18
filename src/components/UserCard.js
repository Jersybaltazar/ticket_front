import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Modal,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const UserCard = ({ user, onDelete, onEdit }) => {
  const { id_users, name, lastName, permission, email } = user;

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedField, setSelectedField] = useState("");

  const handleDeleteClick = () => {
    onDelete(id_users);
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
    onEdit(user, selectedField);
    handleEditModalClose();
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">
          {name} {lastName}
        </Typography>
        <Typography variant="body2">Permiso: {permission}</Typography>
        <Typography variant="body2">Correo Electrónico: {email}</Typography>
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            justifyContent: "space-between",
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
          <Typography variant="h5">Editar Usuario</Typography>
          <FormControl fullWidth>
            <InputLabel>Escoja un campo a editar</InputLabel>
            <Select value={selectedField} onChange={handleFieldChange}>
              <MenuItem value="name">Nombre</MenuItem>
              <MenuItem value="lastName">Apellido</MenuItem>
              <MenuItem value="permission">Permiso</MenuItem>
              <MenuItem value="email">Correo Electrónico</MenuItem>
              {/* Agrega más campos aquí si es necesario */}
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
    </Card>
  );
};

export default UserCard;

