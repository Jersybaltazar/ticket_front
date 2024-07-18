import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const CreateUser = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [permission, setPermission] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handlePermissionChange = (event) => {
    setPermission(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleCreateUser = async() => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/`,{
            method: 'POST',
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                name,
                lastName,
                permission,
                email ,
                password ,
                
            }),
        });
             
        if (response.ok){
            setName("");
            setLastName("");
            setPermission("");
            setEmail("");
            setPassword("");
            
        }else{
            console.error("Error al crear el usuario en el backend");
        }     
    } catch (error) {
        console.error("Error al crear el usario", error);
    }
  };

  return (
    <Container style={{ marginTop: "100px" }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4">Crear Usuario</Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Nombre"
            value={name}
            onChange={handleNameChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Apellido"
            value={lastName}
            onChange={handleLastNameChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Permiso"
            value={permission}
            onChange={handlePermissionChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Correo Electrónico"
            value={email}
            onChange={handleEmailChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Contraseña"
            value={password}
            onChange={handlePasswordChange}
            type="password"
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateUser}
          >
            Crear Usuario
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateUser;
