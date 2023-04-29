import axios from "axios"
import React, { useState } from "react"

function NotesForm(props) {
  const { addNote } = props

  const initInputs = {
    notes: "",
  }

  const [inputs, setInputs] = useState(initInputs)
  const [allNotes, setAllNotes] = useState([])
  const { notes } = inputs

  const handleChange = (e) => {
    const { name, value } = e.target
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addNote(inputs)
    setInputs(initInputs)
  }

  const handleDelete = (noteId) => {
    axios
      .delete(`/notes/${noteId}`)
      .then((res) => {
        setAllNotes((prevState) =>
          prevState.filter((note) => note._id !== noteId)
        )
      })
      .catch((err) => console.log(err.response.data.errMsg))
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="notes"
          value={notes}
          onChange={handleChange}
          placeholder="Notes"
        />
        <button> Submit </button>
      </form>
    </>
  )
}

export default NotesForm
