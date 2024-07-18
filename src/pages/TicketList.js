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
import TicketCard from "./TicketCard"; // Crearemos este componente a continuación
import { Link } from "react-router-dom";
import { styled } from "@mui/system";

const RightAlignedContainer = styled(Container)({
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: "36px",
  marginTop: "30px",
});

const TicketList = () => {
  const [showSearchField, setShowSearchField] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [ticketList, setTicketList] = useState([]);
  const [page, setPage] = useState(1); // Página actual
  const itemsPerPage = 3; // Cantidad de tickets por página

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

  const filteredTickets = ticketList.filter((ticket) =>
    ticket.event_name && ticket.event_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hacer la solicitud GET al endpoint para obtener la lista de tickets
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/ticket/all`)
      .then((response) => response.json())
      .then((data) => {
        setTicketList(data);
      })    
      .catch((error) =>
        console.error("Error obteniendo la lista de tickets:", error)
      );
  }, []);

  // Hacer la solicitud GET al endpoint para eliminar un ticket de la lista
  const handleDeleteClick = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/tickets/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Realiza cualquier acción adicional después de eliminar (por ejemplo, recargar la lista)
        setTicketList((prevList) => prevList.filter((ticket) => ticket.id_ticket !== id));
      } else {
        console.error("Error al eliminar el ticket");
      }
    } catch (error) {
      console.error("Error al eliminar el ticket:", error);
    }
  };

  const handleEditClick = (id) => {
    // Aquí puedes manejar la lógica de edición de tickets
  };

  const handleEditTicket = (updatedTicket) => {
    // Aquí puedes manejar la lógica de edición, por ejemplo, enviando updatedTicket al servidor
    // y luego actualizando el estado ticketList
  };

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * itemsPerPage;

  const displayedTickets = filteredTickets.slice(
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
          <Grid item xs={6} container justifyContent="flex-end">
            {showSearchField ? (
              <div ref={searchRef}>
                <TextField
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  variant="outlined"
                  placeholder="Buscar ticket"
                />
              </div>
            ) : (
              <IconButton onClick={handleSearchClick}>
                <SearchIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>
      </div>

      <CenteredContainer>
        <Grid container spacing={8}>
          {displayedTickets.map((ticket) => (
            <Grid item xs={4} key={ticket.id_ticket}>
              <TicketCard
                ticket={ticket}
                onDelete={handleDeleteClick}
                onEdit={handleEditClick}
                // onUpdate={handleEditTicket}
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

export default TicketList;
