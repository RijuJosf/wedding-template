import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import Login from './pages/Login.tsx'

import Gallery from './pages/Gallery.tsx'
import GuestWishes from './pages/GuestWishes.tsx'
import Template from './pages/Template/Template.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/template" element={<Template />} />
        <Route path='/gallery' element={<Gallery/>}/>
        <Route path='/guestWishes' element={<GuestWishes/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
