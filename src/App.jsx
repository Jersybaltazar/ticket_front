import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from "./pages/dashboard";
import TicketList from "./pages/TicketList";
import UserList from "./pages/UserList"
import CreateTicket from "./pages/createTicket";
import SignIn from './components/auth/SignUp';
import LogIn from './components/auth/LogIn';
import CreateUser from './pages/createUser';
import DetailsAccessory from './pages/AccessoryDetailsFromQR'
function App() {
  const isLoggedIn  = true;

  return (
    <Router>
      <Routes>

      <Route path="/" element={<SignIn/>}/>
      <Route path="/registrar" element={<LogIn/>}/>

      {isLoggedIn ?(
        <>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/accessory" element={<TicketList/>}/>
        <Route path="/user" element={<UserList/>}/>
        <Route path="/create-ticket" element={<CreateTicket/>}/>
        <Route path="/create-user" element={<CreateUser/>}/>
        <Route path="/details/:code_QR" element={<DetailsAccessory/>}/>
        </>
      ):(
        <Navigate to="/login" /> 
      )}

   
      </Routes>
    </Router>
    );
  };


export default App;
