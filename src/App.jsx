import './css/Options.css'
import  Options  from './components/options';
import { Outlet } from 'react-router-dom';
export const backend_url = "http://localhost:3030/graphql"
import {createContext } from "react";


export const UserContext = createContext();
function App() {

  return(
    <> 
          <Options/>
          <Outlet/>
    </>
  )
}

export default App
