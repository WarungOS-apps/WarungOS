import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Kasir from './pages/Kasir'
import Stock from "./pages/Stock"
import Pembukuan from './pages/Pembukuan'
import Orders from './pages/Orders'
import Bookings from './pages/Bookings'
import Customers from './pages/Customers'
import AiForecast from './pages/AiForecast'


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/kasir" element={<Kasir />} />
      <Route path="/stock" element={<Stock />} />
      <Route path="/pembukuan" element={<Pembukuan />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/customers" element={<Customers />} />    
      <Route path="/ai-forecast" element={<AiForecast />} />
    </Routes>
  </BrowserRouter>
)
