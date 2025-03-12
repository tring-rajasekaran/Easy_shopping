import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Router from './Routes/Routes.jsx'



createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Router/>
    </BrowserRouter>
)
