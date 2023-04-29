import React, { useState, useContext } from "react"
import AuthForm from "./AuthForm.js"
import { DrugContext } from "../context/DrugProvider.js"

function Auth() {
  const initInputs = { username: "", password: "" }
  const [inputs, setInputs] = useState(initInputs)
  const [toggle, setToggle] = useState(false)

  const { signup, login, errMsg, resetAuthErr } = useContext(DrugContext)

  const handleChange = (e) => {
    const { name, value } = e.target
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }))
  }

  const handleSignup = (e) => {
    e.preventDefault()
    signup(inputs)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    login(inputs)
  }

  const toggleForm = () => {
    setToggle((prev) => !prev)
    resetAuthErr()
  }
  return (
    <div className='auth-container'>
      {toggle ? (
        <>
          <h3 style={{ margin: "1em" }}>Sign up</h3>
          <AuthForm
            handleChange={handleChange}
            handleSubmit={handleSignup}
            inputs={inputs}
            btnText='Sign up'
            errMsg={errMsg}
          />
          <p onClick={toggleForm}>Login</p>
        </>
      ) : (
        <>
          <h3 style={{ margin: "1em" }}>Sign in to your account</h3>
          <AuthForm
            handleChange={handleChange}
            handleSubmit={handleLogin}
            inputs={inputs}
            btnText='Login'
            errMsg={errMsg}
          />
          <p onClick={toggleForm}>No account yet? Sign up</p>
        </>
      )}
    </div>
  )
}

export default Auth
