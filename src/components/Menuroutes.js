import React from 'react';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";

import Front from '../pages/home';
import Login from '../pages/login';
import Signup from '../pages/signup';
import AdminHome from '../pages/adminhome';


export default function Menuroutes() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Front/>} />
          <Route path="/Login" element={<Login/>} />
          <Route path="/Signup" element={<Signup/>} />
          <Route path="/AdminHome" element={<AdminHome/>} />
          
          
          
        </Routes>
      </Router>
    );
  }
  