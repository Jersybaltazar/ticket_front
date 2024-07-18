import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Container,
  Typography,
  IconButton,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import UserCard from "../components/UserCard"; // Crearemos este componente a continuación
import { Link } from "react-router-dom";
import { styled } from "@mui/system";

const RightAlignedContainer = styled(Container)({
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: "36px",
  marginTop: "30px",
});

const UserList = () => {
  const [showSearchField, setShowSearchField] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userList, setUserList] = useState([]);
  const [page, setPage] = useState(1); // Página actual
  const itemsPerPage = 3; // Cantidad de accesorios por página

  const handleSearchClick = () => {
    setShowSearchField(!showSearchField);
  };
  const handleOutsideClick = useCallback((event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowSearchField(false);
    }
  }, []);

  const searchRef = useRef(null);

 

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);
  // Simulando la lista de accesorios desde la base de datos
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/`); // Ajusta la URL según tu API
        const data = await response.json();
        setUserList(data);
      } catch (error) {
        console.error("Error obteniendo la lista de usuarios:", error);
      }
    };

    fetchUsers();
  }, []);
  const filteredUsers= userList.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const displayedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Actualiza la lista de usuarios después de eliminar
        setUserList((prevList) => prevList.filter((user) => user.id !== id));
      } else {
        console.error('Error al eliminar el usuario');
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  const handleEditUser = (user, field) => {
    // Lógica para manejar la edición del usuario con el campo proporcionado
    // Puedes abrir el modal de edición aquí o realizar otras acciones necesarias
  };

  return (
    <Container maxWidth="lg" fixed={true}>
      <RightAlignedContainer>
        <Button
          variant="outlined"
          component={Link}
          to="/create-user"
          color="secondary"
          disableElevation
        >
          Crear usuario
        </Button>
      </RightAlignedContainer>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Typography variant="h6">Lista de Usuarios</Typography>
          </Grid>
          <Grid item xs={1} container justifyContent="flex-end">
            {showSearchField ? (
              <div ref={searchRef}>
                <TextField
                  value={searchTerm}
                  onChange={handleSearchChange}
                  variant="outlined"
                  placeholder="Buscar un Usuario"
                />
              </div>
            ) : (
              <IconButton>
                <SearchIcon onClick={handleSearchClick}/>
              </IconButton>
            )}
          </Grid>
          
        </Grid>

      <div>
        {/* Map para renderizar las tarjetas de usuario */}
        {displayedUsers.map((user) => (
          <UserCard 
          
          onDelete = {handleDeleteUser}
          key={user.id} user={user} />
        ))}
      </div>

      <div>
        {Array.from({ length: totalPages }).map((_, index) => (
          <Button key={index} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </Button>
        ))}
      </div>
    </Container>
  );
};

export default UserList;
