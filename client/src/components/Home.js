import React, { useState } from "react"
import SearchMeds from "./SearchMeds"

function Home() {
  const [searchValue, setSearchValue] = useState([])
  const [onInputValue, setOnInputValue] = useState("")
  const [inputs, setInputs] = useState("")

  function handleChange(e) {
    const { name, value } = e.target
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }))
  }
  return (
    <div>
      <h1 className='homepage-header'>Drug Interaction Checker</h1>
      <SearchMeds />
    </div>
  )
}

export default Home
