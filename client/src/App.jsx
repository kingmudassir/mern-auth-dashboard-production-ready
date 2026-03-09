import React from 'react'
import Approutes from './routes/Approutes'
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Approutes />
    </BrowserRouter>
  )
}

export default App