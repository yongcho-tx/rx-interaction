import React, { useState } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { RxHamburgerMenu } from "react-icons/rx"
import { HiOutlineX } from "react-icons/hi"

const linkStyle = {
  margin: "1em",
  textDecoration: "none",
  color: "#ffffff",
  fontSize: "16px",
  fontFamily: "Arial",
}

const StyledButton = styled.button`
  cursor: pointer;
  color: #ffffff;
  background-color: #e74c3c;
  border: none;
  font-size: 16px;
  font-family: arial;
  margin: 1em;

  &:hover {
    background-color: #ffffff;
    color: black;
  }
`

function Navbar(props) {
  const { logout, token } = props
  const [nav, setNav] = useState(false)
  const handleClick = () => setNav(!nav)

  return (
    <div className='navbar-container'>
      <ul className='navbar-menu'>
        <li>
          <Link to='/' style={linkStyle}>
            Home
          </Link>
        </li>
        {token && (
          <li>
            <Link to='profile' style={linkStyle}>
              Profile
            </Link>
          </li>
        )}

        <li>
          <Link to='login' style={linkStyle}>
            Login
          </Link>
        </li>
        {token && <StyledButton onClick={logout}>Logout</StyledButton>}
      </ul>

      {/*hamburger menu */}
      <div
        onClick={handleClick}
        style={{ zIndex: 10 }}
        className='hamburger-menu'
      >
        {!nav ? <RxHamburgerMenu size={40} /> : <HiOutlineX size={40} />}
      </div>

      {/*mobile menu */}
      <ul className={!nav ? "hide-hamburger" : "show-hamburger"}>
        <li>
          <Link onClick={handleClick} to='/'>
            Home
          </Link>
        </li>
        <li>
          <Link onClick={handleClick} to='/profile'>
            Profile
          </Link>
        </li>
        <li>
          <Link onClick={handleClick} to='/login'>
            Login
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Navbar
