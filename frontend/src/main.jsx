import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {ListadoApp} from './ListadoApp'
import './styles.css'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ListadoApp/>
  </StrictMode>,
)

 