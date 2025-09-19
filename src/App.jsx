import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Join from './pages/Join.jsx'
import Room from './pages/Room.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Join />} />
        <Route path="/room" element={<Room />} />
      </Routes>
    </BrowserRouter>
  )
}
