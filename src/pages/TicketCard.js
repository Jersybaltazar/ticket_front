import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

const TicketCard = ({ ticket, onDelete, onEdit }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{ticket.event_name}</Typography>
        <Typography variant="body2">{ticket.date}</Typography>
        <Typography variant="body2">{ticket.time}</Typography>
        <Typography variant="body2">{ticket.attendee_name}</Typography>
        <Typography variant="body2">{ticket.seat}</Typography>
        <Typography variant="body2">${ticket.price}</Typography>
        <Button onClick={() => onEdit(ticket.id_ticket)}>Editar</Button>
        <Button onClick={() => onDelete(ticket.id_ticket)}>Eliminar</Button>
      </CardContent>
    </Card>
  );
};

export default TicketCard;
