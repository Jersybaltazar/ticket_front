  import React, { useState, useEffect, useRef } from "react";
  import {
    Container,
    Typography,
    IconButton,
    TextField,
    Button,
    Grid,
  } from "@mui/material";
  import { Search as SearchIcon } from "@mui/icons-material";
  import AccessoryCard from "../components/AccesoryCard"; // Crearemos este componente a continuación
  import { Link } from "react-router-dom";
  import { styled } from "@mui/system";
  import { isAfter, addDays } from 'date-fns';

  const RightAlignedContainer = styled(Container)({
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "36px",
    marginTop: "30px",  
  });

  const AccessoryList = () => {
    const [showSearchField, setShowSearchField] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [accessoryList, setAccessoryList] = useState([]);
    const [page, setPage] = useState(1); // Página actual
    const itemsPerPage = 3; // Cantidad de accesorios por página

   
    //search
    const handleSearchClick = () => {
      setShowSearchField(!showSearchField);
    };

    const searchRef = useRef(null);

    useEffect(() => {
      const handleOutsideClick = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
          setShowSearchField(false);
        }
      };

      document.addEventListener("mousedown", handleOutsideClick);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }, []);

    const filteredAccessories = accessoryList.filter((accessory) =>
      accessory.name && accessory.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const currentDate = new Date();
    const calculateNextMaintenanceDate  =  (purchaseDate, maintenanceInterval)=>{
      return addDays(purchaseDate,maintenanceInterval)
    };

  const determineMaintenanceStatus = (accessory) => {
      const nextMaintenanceDate = calculateNextMaintenanceDate(
        new Date(accessory.purchase_date),
        parseInt(accessory.mantenimiento)
      );
  
      return isAfter(currentDate, nextMaintenanceDate) ? 'Pendiente' : 'Realizado';
    };

  // Hacer la solicitud GET al endpoint para obtener la lista de accesorios
    useEffect(() => {
    
      fetch(`${process.env.REACT_APP_BACKEND_URL}/accesories/all`)
        .then((response) => response.json())
        .then((data) => {
     
          const accesoriesWithImagesUrl = data.map((accessory) => {
            
            return accessory;
          });
          setAccessoryList(accesoriesWithImagesUrl);
        })
        .catch((error) =>
          console.error("Error obteniendo la lista de accesorios:", error)
        );
    }, []);

// Hacer la solicitud GET al endpoint para eliminar un id de  la lista de accesorios
    const handleDeleteClick = async (id) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/accesories/${id}`, {
          method: 'DELETE',
        });
    
        if (response.ok) {
          // Realiza cualquier acción adicional después de eliminar (por ejemplo, recargar la lista)
          setAccessoryList((prevList) => prevList.filter((accessory) => accessory.id_accesorie !== id));
        } else {
          console.error('Error al eliminar el accesorio');
        }
      } catch (error) {
        console.error('Error al eliminar el accesorio:', error);
      }
    };


    const handleEditClick = (id) => {
  
    }

    const totalPages = Math.ceil(filteredAccessories.length / itemsPerPage);



    const handlePageChange = (newPage) => {
      setPage(newPage);
    };

    const startIndex = (page - 1) * itemsPerPage;
    
    const displayedAccessories = filteredAccessories.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    const CenteredContainer = styled(Container)({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: "30px",
    });

    return (
      <Container maxWidth="lg" fixed={true}>
        <RightAlignedContainer>
          <Button
            variant="outlined"
            component={Link}
            to="/create-ticket"
            color="secondary"
            disableElevation
          >
            Crear Ticket
          </Button>
        </RightAlignedContainer>

        <div>
          <Grid container alignItems="center">
            <Grid item xs={6}>
              <Typography variant="h6">Lista de Tickets</Typography>
            </Grid>
            <Grid d="true" item xs={6} container justifyContent="flex-end">
              {showSearchField ? (
                <div ref={searchRef}>
                  <TextField
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    variant="outlined"
                    placeholder="Buscar accesorio"
                  />
                </div>
              ) : (
                <IconButton onClick={handleSearchClick}>
                  <SearchIcon  />
                </IconButton>
              )}
            </Grid>
          </Grid>
        </div>
        
        <CenteredContainer>
        <Grid container spacing={8}>
          {displayedAccessories.map((accessory) => (
            <Grid item xs={4} key={accessory.id_accesorie}>
              <AccessoryCard
                key={accessory}
                accessory={accessory}
                onDelete={handleDeleteClick}
                maintenanceStatus={determineMaintenanceStatus(accessory)}
                onEdit={handleEditClick} 
              //  onUpdate={handleEditAccessory}
              />
            </Grid>
          ))}
        </Grid>
        </CenteredContainer>
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

  export default AccessoryList;
