import React, { useContext } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import SearchMeds from "./components/SearchMeds.js"
import XInteractions from "./components/XInteractions.js"
import Profile from "./components/Profile.js"
import styled from "styled-components"
import Navbar from "./components/Navbar.js"
import Auth from "./components/Auth.js"
import Home from "./components/Home.js"
import ProtectedRoute from "./components/ProtectedRoute.js"
import { DrugContext } from "./context/DrugProvider.js"

const AppContainer = styled.div`
width: 100%;
height; 100%;
display: flex;
justify-content: center;
margin-top: 8em;
`

function App() {
  const { token, logout } = useContext(DrugContext)

  return (
    <div>
      <Navbar logout={logout} token={token} />
      <AppContainer>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route
            path='/login'
            element={token ? <Navigate to='/profile' /> : <Auth />}
          />
          <Route
            path='/profile'
            element={
              <ProtectedRoute token={token}>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AppContainer>
    </div>
  )
}

export default App
